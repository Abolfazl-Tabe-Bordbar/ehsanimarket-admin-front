import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import TicketCategories from "@/components/templates/P-Admin/Support/TicketCategories";

export const metadata = {
  title: "احسانی مارکت - موضوعات تیکت",
};

function page() {
  return (
    <AdminPageShell title="موضوعات تیکت" description="دسته‌هایی که مشتری هنگام ثبت تیکت انتخاب می‌کند">
      <TicketCategories />
    </AdminPageShell>
  );
}

export default page;
