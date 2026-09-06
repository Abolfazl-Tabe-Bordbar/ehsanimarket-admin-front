import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import ApprovalMessagesClient from "./ApprovalMessagesClient";

function Main({ data }) {
  return (
    <AdminPageShell
      title="پیام‌های تأیید سفارش"
      description="تعریف پیام‌های آماده برای تأیید سفارشات پرداخت‌شده"
    >
      <ApprovalMessagesClient data={data} />
    </AdminPageShell>
  );
}

export default Main;
