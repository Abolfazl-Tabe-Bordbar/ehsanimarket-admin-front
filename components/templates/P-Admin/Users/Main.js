import React from "react";
import UsersList from "@/components/templates/P-Admin/Users/UsersList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="کاربران سایت"
      description="لیست کاربران ثبت‌نام‌شده با امکان فیلتر بر اساس استان و شهر"
    >
      <UsersList data={data} />
    </AdminPageShell>
  );
}

export default Main;
