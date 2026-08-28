import React from "react";
import AddSubcategoryButton from "./AddSubcategoryButton";
import SubcategoriesList from "./SubcategoriesList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="زیردسته‌ها"
      description="مدیریت زیردسته محصولات"
      actions={<AddSubcategoryButton />}
    >
      <SubcategoriesList data={data} />
    </AdminPageShell>
  );
}

export default Main;
