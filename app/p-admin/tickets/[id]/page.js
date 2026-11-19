import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import TicketDetail from "@/components/templates/P-Admin/Support/TicketDetail";

export const metadata = {
  title: "احسانی مارکت - جزئیات تیکت",
};

async function page({ params }) {
  const { id } = await params;
  return (
    <AdminPageShell title="جزئیات تیکت" description="گفتگو با مشتری، وضعیت، اولویت و ارجاع">
      <TicketDetail ticketId={id} />
    </AdminPageShell>
  );
}

export default page;
