import { baseUrl } from "@/data/variables";

// وضعیت مدیر (شمارنده خریدها و تیکت‌ها، دسترسی‌ها) بدون نمایش خطا؛
// برای به‌روزرسانی دوره‌ای استفاده می‌شود تا قطعی لحظه‌ای اینترنت پیام خطا نشان ندهد.
async function getAdminStatus() {
  try {
    const res = await fetch(`${baseUrl}/is_login`, { cache: "no-store" });
    return await res.json();
  } catch {
    return null;
  }
}

export default getAdminStatus;
