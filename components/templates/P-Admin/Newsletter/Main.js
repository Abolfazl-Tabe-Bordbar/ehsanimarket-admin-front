import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import SubscribersList from "./SubscribersList";

function Main({ data }) {
  return (
    <AdminPageShell
      title="خبرنامه مقالات"
      description="مدیریت مشترکین دریافت پیامک مقالات جدید"
    >
      <SubscribersList data={data} />
    </AdminPageShell>
  );
}

export default Main;
