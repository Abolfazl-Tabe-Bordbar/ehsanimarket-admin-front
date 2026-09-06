import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import RejectionReasonsClient from "./RejectionReasonsClient";

function Main({ data }) {
  return (
    <AdminPageShell
      title="دلایل رد خرید"
      description="تعریف دلایل آماده برای رد سفارشات پرداخت‌شده"
    >
      <RejectionReasonsClient data={data} />
    </AdminPageShell>
  );
}

export default Main;
