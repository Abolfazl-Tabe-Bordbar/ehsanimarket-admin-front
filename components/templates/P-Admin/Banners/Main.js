import React from "react";
import AddBannerButton from "./AddBannerButton";
import BannerGuidelines from "./BannerGuidelines";
import BannersList from "./BannersList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="بنرها"
      description="مدیریت بنرها بر اساس صفحه و مکان نمایش"
      actions={<AddBannerButton />}
    >
      <BannerGuidelines />
      <BannersList data={data} />
    </AdminPageShell>
  );
}

export default Main;
