export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://api.ehsanimarket.ir");
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://ehsanimarket.ir");
// در مرورگر همه درخواست‌ها از پروکسی خود سایت عبور می‌کنند تا توکن (کوکی HttpOnly)
// سمت سرور اضافه شود. سمت سرور (Server Components و middleware) مستقیم به API وصل می‌شود.
export const baseUrl =
  typeof window !== "undefined" ? "/api/proxy/admins" : `${apiBaseUrl}/admins`;
export const uploadUrl = `${apiBaseUrl}/upload`;