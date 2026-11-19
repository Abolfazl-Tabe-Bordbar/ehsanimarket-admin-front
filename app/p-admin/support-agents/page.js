import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import SupportAgents from "@/components/templates/P-Admin/Support/SupportAgents";

export const metadata = {
  title: "احسانی مارکت - کاربران پشتیبانی",
};

function page() {
  return (
    <AdminPageShell title="کاربران پشتیبانی" description="کارشناس‌هایی که به تیکت‌ها پاسخ می‌دهند">
      <SupportAgents />
    </AdminPageShell>
  );
}

export default page;
