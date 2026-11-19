import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import TicketsMain from "@/components/templates/P-Admin/Support/TicketsMain";

export const metadata = {
  title: "احسانی مارکت - تیکت‌های پشتیبانی",
};

async function page({ searchParams }) {
  const assigned = (await searchParams)?.assigned || "";
  return (
    <AdminPageShell title="تیکت‌های پشتیبانی" description="درخواست‌های مشتریان؛ اول تیکت‌های بی‌پاسخ و فوری">
      <TicketsMain initialAssigned={assigned} />
    </AdminPageShell>
  );
}

export default page;
