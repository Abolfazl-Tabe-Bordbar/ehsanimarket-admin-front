import React, { Suspense } from "react";
import Link from "next/link";
import PurchasesList from "./PurchasesList";
import PurchaseStatusTabs from "./PurchaseStatusTabs";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

const quickLinks = [
  {
    href: "/p-admin/approval-messages?stage=approve",
    label: "پیام‌های تایید",
    icon: CheckCircleOutlineIcon,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  {
    href: "/p-admin/approval-messages?stage=preparing",
    label: "پیام‌های آماده‌سازی",
    icon: Inventory2OutlinedIcon,
    className: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
  },
  {
    href: "/p-admin/approval-messages?stage=shipping",
    label: "پیام‌های ارسال",
    icon: OutboxOutlinedIcon,
    className: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  },
  {
    href: "/p-admin/rejection-reasons",
    label: "دلایل رد خرید",
    icon: BlockOutlinedIcon,
    className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  },
];

function Main({ status, purchasesByStatus = {} }) {
  const activePurchases = purchasesByStatus[status] || purchasesByStatus.pending;
  const tabCounts = Object.fromEntries(
    Object.entries(purchasesByStatus).map(([key, value]) => [key, value?.countAll || 0])
  );

  return (
    <AdminPageShell
      title="خریدها"
      description="پیگیری مراحل سفارشات کاربران"
      actions={
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs md:text-sm font-bold transition-colors ${link.className}`}
              >
                <Icon sx={{ fontSize: 16 }} />
                {link.label}
              </Link>
            );
          })}
        </div>
      }
    >
      <PurchaseStatusTabs status={status} counts={tabCounts} />

      <Suspense
        fallback={
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            در حال بارگذاری سفارش‌ها...
          </div>
        }
      >
        <PurchasesList purchases={activePurchases} tabStatus={status} />
      </Suspense>
    </AdminPageShell>
  );
}

export default Main;
