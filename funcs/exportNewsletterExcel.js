import downloadExcelExport from "./downloadExcelExport";

// فایل مستقیم دانلود می‌شود و خروجی { status } است
async function exportNewsletterExcel(filters = {}) {
  return downloadExcelExport("/newsletter/export", filters, "newsletter.xlsx");
}

export default exportNewsletterExcel;
