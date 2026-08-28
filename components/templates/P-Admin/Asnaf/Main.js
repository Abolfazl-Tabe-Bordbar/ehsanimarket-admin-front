import React from "react";
import AsnafList from "@/components/templates/P-Admin/Asnaf/AsnafList";
import AddSenfButton from "@/components/templates/P-Admin/Asnaf/AddSenfButton";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="دسته‌بندی‌ها"
      description="مدیریت دسته‌بندی اصلی"
      actions={<AddSenfButton />}
    >
      <AsnafList data={data} />
    </AdminPageShell>
  );
}

export default Main;
