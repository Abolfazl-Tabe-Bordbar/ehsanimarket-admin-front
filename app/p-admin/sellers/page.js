import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import SellersMain from "@/components/templates/P-Admin/Sellers/SellersMain";

export const metadata = {
  title: "احسانی مارکت - فروشندگان",
};

function page() {
  return (
    <AdminPageShell title="فروشندگان" description="فروشندگان حضوری و تلفنی که با اپ فروشنده برای مشتری سفارش ثبت می‌کنند">
      <SellersMain />
    </AdminPageShell>
  );
}

export default page;
