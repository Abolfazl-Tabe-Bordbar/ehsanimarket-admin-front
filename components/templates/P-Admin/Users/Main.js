import React, { Suspense } from "react";
import UsersList from "@/components/templates/P-Admin/Users/UsersList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="کاربران سایت"
      description="لیست کاربران ثبت‌نام‌شده با امکان فیلتر بر اساس استان و شهر"
    >
      <Suspense
        fallback={
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            در حال بارگذاری کاربران...
          </div>
        }
      >
        <UsersList data={data} />
      </Suspense>
    </AdminPageShell>
  );
}

export default Main;
