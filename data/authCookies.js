// کوکی توکن (HttpOnly؛ فقط سمت سرور Next خوانده می‌شود)
export const AUTH_COOKIE = "ramian-pakhsh-admin";
// کوکی نشانگر ورود (قابل‌خواندن در مرورگر، بدون اطلاعات محرمانه)
export const SESSION_FLAG_COOKIE = "ramian-pakhsh-admin-session";
// باید با مدت اعتبار JWT در API هماهنگ باشد (پیش‌فرض ۷ روز)
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
