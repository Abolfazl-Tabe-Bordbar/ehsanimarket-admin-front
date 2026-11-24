import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import KcoStockSyncLogs from "@/components/templates/P-Admin/Kco/KcoStockSyncLogs";

export const metadata = {
  title: "احسانی مارکت - همگام‌سازی موجودی کارآمد",
};

function page() {
  return (
    <AdminPageShell
      title="همگام‌سازی موجودی کارآمد"
      description="لاگ همگام‌سازی خودکار با سیستم کارآمد، وضعیت کرون و اجرای دستی"
    >
      <KcoStockSyncLogs />
    </AdminPageShell>
  );
}

export default page;