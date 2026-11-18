import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/data/variables";
import { AUTH_COOKIE, SESSION_FLAG_COOKIE, AUTH_COOKIE_MAX_AGE } from "@/data/authCookies";

// پروکسی سمت سرور Next برای API.
// توکن فقط در کوکی HttpOnly نگه داشته می‌شود و جاوااسکریپت مرورگر به آن دسترسی ندارد؛
// این route توکن را از کوکی برمی‌دارد و به‌صورت هدر `cookies` به API می‌فرستد.

const FORWARDED_REQUEST_HEADERS = ["content-type", "accept", "accept-language", "user-agent"];
const FORWARDED_RESPONSE_HEADERS = ["content-type", "content-disposition", "cache-control", "last-modified", "etag"];

function getRequestHost(request) {
  return (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host
  ).split(",")[0].trim();
}

function isSecureRequest(request) {
  const proto = (request.headers.get("x-forwarded-proto") || "").split(",")[0].trim();
  if (proto) return proto === "https";
  return request.nextUrl.protocol === "https:";
}

/**
 * جلوگیری از CSRF: چون احراز هویت حالا با کوکی است، فقط درخواست‌های
 * خود سایت (same-origin) پذیرفته می‌شوند.
 */
export function isSameOriginRequest(request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) {
    return fetchSite === "same-origin";
  }

  const source = request.headers.get("origin") || request.headers.get("referer");
  if (!source) {
    // مرورگرهای خیلی قدیمی: فقط درخواست‌های خواندنی بدون Origin پذیرفته می‌شوند
    return request.method === "GET" || request.method === "HEAD";
  }

  try {
    return new URL(source).host === getRequestHost(request);
  } catch {
    return false;
  }
}

function cookieOptions(request, { httpOnly }) {
  return {
    httpOnly,
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  };
}

export function setAuthCookies(response, request, token) {
  response.cookies.set(AUTH_COOKIE, token, cookieOptions(request, { httpOnly: true }));
  // کوکی قابل‌خواندن فقط برای اینکه UI بداند کاربر وارد شده (هیچ اطلاعات محرمانه‌ای ندارد)
  response.cookies.set(SESSION_FLAG_COOKIE, "1", cookieOptions(request, { httpOnly: false }));
}

export function clearAuthCookies(response, request) {
  for (const name of [AUTH_COOKIE, SESSION_FLAG_COOKIE]) {
    response.cookies.set(name, "", { ...cookieOptions(request, { httpOnly: name === AUTH_COOKIE }), maxAge: 0 });
  }
}

function forbidden() {
  return NextResponse.json(
    { status: false, message: "درخواست نامعتبر است" },
    { status: 403 }
  );
}

// مسیر درخواست به شکل /api/proxy/<prefix>/... است و فقط همان بخش API مجاز است
function buildUpstreamUrl(prefix, segments, search) {
  if (!Array.isArray(segments) || segments.length < 2 || segments[0] !== prefix) return null;
  for (const segment of segments) {
    if (!segment || segment === "." || segment === ".." || segment.includes("/") || segment.includes("\\")) {
      return null;
    }
  }
  const path = segments.slice(1).map((segment) => encodeURIComponent(segment)).join("/");
  return `${apiBaseUrl.replace(/\/$/, "")}/${prefix}/${path}${search || ""}`;
}

/**
 * @param {{ prefix: string, tokenPaths: string[] }} config
 *   prefix: بخش API که این فرانت اجازه دسترسی به آن را دارد (users یا admins)
 *   tokenPaths: مسیرهایی که در پاسخ توکن برمی‌گردانند
 */
export function createApiProxy({ prefix, tokenPaths }) {
  const tokenPathSet = new Set(tokenPaths);

  return async function handler(request, context) {
    if (!isSameOriginRequest(request)) {
      return forbidden();
    }

    const { path: segments } = await context.params;
    const upstreamUrl = buildUpstreamUrl(prefix, segments, request.nextUrl.search);
    if (!upstreamUrl) {
      return forbidden();
    }

    const headers = new Headers();
    for (const name of FORWARDED_REQUEST_HEADERS) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    const token = request.cookies.get(AUTH_COOKIE)?.value || "";
    if (token) headers.set("cookies", token);

    const clientIp =
      (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "";
    if (clientIp) headers.set("x-forwarded-for", clientIp);

    const hasBody = !["GET", "HEAD"].includes(request.method);

    let upstream;
    try {
      upstream = await fetch(upstreamUrl, {
        method: request.method,
        headers,
        body: hasBody ? request.body : undefined,
        duplex: hasBody ? "half" : undefined,
        redirect: "manual",
        cache: "no-store",
      });
    } catch (error) {
      console.error("API proxy error:", upstreamUrl, error?.message);
      return NextResponse.json(
        { status: false, message: "ارتباط با سرور برقرار نشد" },
        { status: 502 }
      );
    }

    const routePath = segments.slice(1).join("/");
    const contentType = upstream.headers.get("content-type") || "";

    // پاسخ مسیرهای ورود: توکن در کوکی HttpOnly ذخیره و از بدنه پاسخ حذف می‌شود
    if (tokenPathSet.has(routePath) && contentType.includes("application/json")) {
      const data = await upstream.json().catch(() => null);
      if (data && typeof data === "object" && typeof data.token === "string" && data.token) {
        const { token: issuedToken, ...rest } = data;
        const response = NextResponse.json({ ...rest, authenticated: true }, { status: upstream.status });
        setAuthCookies(response, request, issuedToken);
        return response;
      }
      return NextResponse.json(data ?? { status: false }, { status: upstream.status });
    }

    const responseHeaders = new Headers();
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    const response = new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });

    // اگر توکن وجود ندارد ولی کوکی نشانگر مانده، پاکش کن تا UI وضعیت درست را نشان دهد
    if (!token && request.cookies.get(SESSION_FLAG_COOKIE)) {
      clearAuthCookies(response, request);
    }

    return response;
  };
}

export function createLogoutHandler() {
  return async function handler(request) {
    if (!isSameOriginRequest(request)) {
      return forbidden();
    }
    const response = NextResponse.json({ status: true });
    clearAuthCookies(response, request);
    return response;
  };
}
