import React from "react";
import AddFaqButton from "./AddFaqButton";
import FaqList from "./FaqList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="سوالات متداول"
      description="مدیریت پرسش‌های پرتکرار"
      actions={<AddFaqButton />}
    >
      <FaqList data={data} />
    </AdminPageShell>
  );
}

export default Main;
