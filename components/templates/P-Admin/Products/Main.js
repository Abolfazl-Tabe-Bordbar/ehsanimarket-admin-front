import React from "react";
import ProductsList from "@/components/templates/P-Admin/Products/ProductsList";
import AddProductButton from "@/components/templates/P-Admin/Products/AddProductButton";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="محصولات"
      description="مدیریت محصولات فروشگاه"
      actions={<AddProductButton />}
    >
      <ProductsList data={data} />
    </AdminPageShell>
  );
}

export default Main;
