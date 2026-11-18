import downloadExcelExport from "./downloadExcelExport";

// فایل مستقیم دانلود می‌شود و خروجی { status } است
async function exportUsersExcel(filters = {}) {
  return downloadExcelExport("/users/export", filters, "users.xlsx");
}

export default exportUsersExcel;
