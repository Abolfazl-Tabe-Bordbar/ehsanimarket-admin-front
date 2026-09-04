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
export const baseUrl = `${apiBaseUrl}/admins`;
export const uploadUrl = `${apiBaseUrl}/upload`;