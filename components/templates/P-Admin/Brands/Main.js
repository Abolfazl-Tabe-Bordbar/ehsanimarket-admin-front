import React from "react";
import AddBrandButton from "./AddBrandButton";
import BrandsList from "./BrandsList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="برندها"
      description="مدیریت برندهای محصولات و لوگوی آن‌ها"
      actions={<AddBrandButton />}
    >
      <BrandsList data={data} />
    </AdminPageShell>
  );
}

export default Main;
