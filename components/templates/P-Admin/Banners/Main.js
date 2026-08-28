import React from "react";
import AddBannerButton from "./AddBannerButton";
import BannersList from "./BannersList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="بنرها"
      description="مدیریت بنرها بر اساس صفحه و مکان نمایش"
      actions={<AddBannerButton />}
    >
      <BannersList data={data} />
    </AdminPageShell>
  );
}

export default Main;
