import React from "react";
import Link from "next/link";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const tabs = [
  {
    key: "pending",
    label: "در انتظار تایید",
    hint: "بررسی و تایید",
    icon: PendingActionsOutlinedIcon,
    theme: {
      idle: "border-amber-200/80 bg-gradient-to-b from-amber-50 to-orange-50/50 text-amber-800 hover:border-amber-300 hover:shadow-sm",
      active:
        "border-amber-400 bg-gradient-to-b from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200/70",
      iconIdle: "bg-amber-100 text-amber-600",
      iconActive: "bg-white/20 text-white",
      countIdle: "bg-amber-500 text-white",
      countActive: "bg-white text-amber-600",
    },
  },
  {
    key: "preparing",
    label: "در حال آماده‌سازی",
    hint: "بسته‌بندی سفارش",
    icon: Inventory2OutlinedIcon,
    theme: {
      idle: "border-sky-200/80 bg-gradient-to-b from-sky-50 to-blue-50/50 text-sky-800 hover:border-sky-300 hover:shadow-sm",
      active:
        "border-sky-400 bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-md shadow-sky-200/70",
      iconIdle: "bg-sky-100 text-sky-600",
      iconActive: "bg-white/20 text-white",
      countIdle: "bg-sky-500 text-white",
      countActive: "bg-white text-sky-600",
    },
  },
  {
    key: "shipping",
    label: "در حال ارسال",
    hint: "در مسیر تحویل",
    icon: LocalShippingOutlinedIcon,
    theme: {
      idle: "border-indigo-200/80 bg-gradient-to-b from-indigo-50 to-violet-50/50 text-indigo-800 hover:border-indigo-300 hover:shadow-sm",
      active:
        "border-indigo-400 bg-gradient-to-b from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200/70",
      iconIdle: "bg-indigo-100 text-indigo-600",
      iconActive: "bg-white/20 text-white",
      countIdle: "bg-indigo-500 text-white",
      countActive: "bg-white text-indigo-600",
    },
  },
  {
    key: "shipped",
    label: "ارسال شده",
    hint: "تحویل داده شده",
    icon: CheckCircleOutlineIcon,
    theme: {
      idle: "border-emerald-200/80 bg-gradient-to-b from-emerald-50 to-green-50/50 text-emerald-800 hover:border-emerald-300 hover:shadow-sm",
      active:
        "border-emerald-400 bg-gradient-to-b from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-200/70",
      iconIdle: "bg-emerald-100 text-emerald-600",
      iconActive: "bg-white/20 text-white",
      countIdle: "bg-emerald-500 text-white",
      countActive: "bg-white text-emerald-600",
    },
  },
  {
    key: "not-send",
    label: "رد شده",
    hint: "لغو یا رد سفارش",
    icon: CancelOutlinedIcon,
    theme: {
      idle: "border-rose-200/80 bg-gradient-to-b from-rose-50 to-red-50/50 text-rose-800 hover:border-rose-300 hover:shadow-sm",
      active:
        "border-rose-400 bg-gradient-to-b from-rose-500 to-red-600 text-white shadow-md shadow-rose-200/70",
      iconIdle: "bg-rose-100 text-rose-600",
      iconActive: "bg-white/20 text-white",
      countIdle: "bg-rose-500 text-white",
      countActive: "bg-white text-rose-600",
    },
  },
];

function PurchaseStatusTabs({ status, counts = {} }) {
  return (
    <div className="purchase-status-tabs-wrap">
      <div className="purchase-status-tabs-grid">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = status === tab.key;
          const count = counts[tab.key] ?? 0;

          return (
            <Link
              key={tab.key}
              href={`/p-admin/purchases?p=1&status=${tab.key}`}
              title={tab.hint}
              className={`purchase-status-tab border transition-all duration-200 ${
                isActive ? tab.theme.active : tab.theme.idle
              } ${tab.key === "not-send" ? "purchase-status-tab-rejected" : ""}`}
            >
              <span className="relative">
                <span
                  className={`purchase-status-tab-icon ${
                    isActive ? tab.theme.iconActive : tab.theme.iconIdle
                  }`}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </span>
                {count > 0 && (
                  <span
                    className={`purchase-status-tab-count ${
                      isActive ? tab.theme.countActive : tab.theme.countIdle
                    }`}
                  >
                    {count.toLocaleString("fa")}
                  </span>
                )}
              </span>
              <span className="purchase-status-tab-label">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default PurchaseStatusTabs;
