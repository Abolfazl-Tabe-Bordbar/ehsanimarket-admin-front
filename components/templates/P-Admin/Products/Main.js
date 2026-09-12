import React, { Suspense } from "react";
import ProductsList from "@/components/templates/P-Admin/Products/ProductsList";
import AddProductButton from "@/components/templates/P-Admin/Products/AddProductButton";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data, asnaf = [], brands = [] }) {
  return (
    <AdminPageShell
      title="محصولات"
      description="مدیریت محصولات فروشگاه"
      actions={<AddProductButton />}
    >
      <Suspense
        fallback={
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            در حال بارگذاری محصولات...
          </div>
        }
      >
        <ProductsList data={data} asnaf={asnaf} brands={brands} />
      </Suspense>
    </AdminPageShell>
  );
}

export default Main;
