import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import SupportReports from "@/components/templates/P-Admin/Support/SupportReports";

export const metadata = {
  title: "احسانی مارکت - گزارش پشتیبانی",
};

function page() {
  return (
    <AdminPageShell title="گزارش پشتیبانی" description="تعداد تیکت‌ها، موضوعات پرتکرار، زمان پاسخگویی و رضایت مشتریان">
      <SupportReports />
    </AdminPageShell>
  );
}

export default page;
