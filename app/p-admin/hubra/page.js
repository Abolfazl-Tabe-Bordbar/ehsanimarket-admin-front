import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import HubraMain from "@/components/templates/P-Admin/Hubra/HubraMain";

export const metadata = {
  title: "احسانی مارکت - ارسال به کانال‌ها (هابرا)",
};

function page() {
  return (
    <AdminPageShell title="ارسال به کانال‌ها" description="ارسال همزمان پیام و فایل به کانال‌های تلگرام، بله و ... از طریق هابرا">
      <HubraMain />
    </AdminPageShell>
  );
}

export default page;
