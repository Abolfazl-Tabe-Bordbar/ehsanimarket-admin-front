import React from "react";
import Link from "next/link";
import SendPurchasesList from "./SendPurchasesList";
import NotSendPurchasesList from "./NotSendPurchasesList";
import PendingPurchasesList from "./PendingPurchasesList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ status, sendPurchases, notSendPurchases, pendingPurchases }) {
  return (
    <AdminPageShell
      title="خریدها"
      description="پیگیری سفارشات کاربران"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href="/p-admin/approval-messages" className="admin-btn-secondary">
            پیام‌های تأیید
          </Link>
          <Link href="/p-admin/rejection-reasons" className="admin-btn-secondary">
            دلایل رد خرید
          </Link>
        </div>
      }
    >
      <div className="admin-tabs">
        <Link
          href="/p-admin/purchases?p=1&status=pending"
          className={`admin-tab ${status === "pending" ? "admin-tab-active" : ""}`}
        >
          خریدهای جاری
        </Link>
        <Link
          href="/p-admin/purchases?p=1&status=send"
          className={`admin-tab ${status === "send" ? "admin-tab-active" : ""}`}
        >
          ارسال‌شده
        </Link>
        <Link
          href="/p-admin/purchases?p=1&status=not-send"
          className={`admin-tab ${status === "not-send" ? "admin-tab-active" : ""}`}
        >
          ارسال‌نشده
        </Link>
      </div>
      {status === "send" ? (
        <SendPurchasesList purchases={sendPurchases} />
      ) : status === "not-send" ? (
        <NotSendPurchasesList purchases={notSendPurchases} />
      ) : status === "pending" ? (
        <PendingPurchasesList purchases={pendingPurchases} />
      ) : null}
    </AdminPageShell>
  );
}

export default Main;
