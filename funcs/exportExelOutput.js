import downloadExcelExport from "./downloadExcelExport";

// فایل مستقیم دانلود می‌شود و خروجی { status } است
async function exportExelOutput(exportData) {
  return downloadExcelExport("/products/export", exportData, "products.xlsx");
}

export default exportExelOutput;
