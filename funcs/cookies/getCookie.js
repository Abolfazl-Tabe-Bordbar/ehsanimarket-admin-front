import { AUTH_COOKIE, SESSION_FLAG_COOKIE } from "@/data/authCookies";

function readCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// returns the cookie with the given name, or undefined if not found.
// توکن ورود در کوکی HttpOnly است و از جاوااسکریپت قابل خواندن نیست؛
// برای نام کوکی توکن، مقدار کوکی نشانگر ورود برگردانده می‌شود تا
// بررسی‌های «کاربر وارد شده؟» مثل قبل کار کنند. ارسال توکن واقعی به API
// را route پروکسی (/api/proxy) انجام می‌دهد.
function getCookie(name) {
  if (name === AUTH_COOKIE) {
    return readCookie(SESSION_FLAG_COOKIE);
  }
  return readCookie(name);
}

export default getCookie;
