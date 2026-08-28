import React from "react";
import AddAdminButton from "./AddAdminButton";
import AdminsList from "./AdminsList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ adminsData, permissionsData }) {
  return (
    <AdminPageShell
      title="مدیریت ادمین‌ها"
      description="کاربران پنل مدیریت"
      actions={<AddAdminButton />}
    >
      <AdminsList adminsData={adminsData} permissionsData={permissionsData} />
    </AdminPageShell>
  );
}

export default Main;
