import { NextResponse } from "next/server";
import { baseUrl } from "./data/variables";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ramian-pakhsh-admin");

  try {
    const res = await fetch(`${baseUrl}/is_login`, {
      headers: {
        cookies: token?.value,
      },
    });
    const resData = await res.json();

    if (!token || !res.ok || !resData.status) {
      if (pathname.startsWith("/p-admin")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } else if (token && res.ok && resData.status) {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/p-admin/dashboard", request.url));
      }
      return NextResponse.next();
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/p-admin/:path*"],
};