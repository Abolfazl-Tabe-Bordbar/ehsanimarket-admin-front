"use client";

import React from "react";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AllInboxOutlinedIcon from "@mui/icons-material/AllInboxOutlined";

// هم‌شکل تب‌های بخش خریدها
const theme = (color, to) => ({
  idle: `border-${color}-200/80 bg-gradient-to-b from-${color}-50 to-${to}-50/50 text-${color}-800 hover:border-${color}-300 hover:shadow-sm`,
  active: `border-${color}-400 bg-gradient-to-b from-${color}-500 to-${to}-600 text-white shadow-md shadow-${color}-200/70`,
  iconIdle: `bg-${color}-100 text-${color}-600`,
  countIdle: `bg-${color}-500 text-white`,
  countActive: `bg-white text-${color}-600`,
});

const tabs = [
  { key: "active", label: "همه تیکت‌های باز", hint: "همه به‌جز بسته‌شده", icon: InboxOutlinedIcon, theme: theme("orange", "amber") },
  { key: "open", label: "ثبت‌شده", hint: "هنوز بررسی نشده", icon: FiberNewOutlinedIcon, theme: theme("sky", "blue") },
  { key: "in_progress", label: "در حال بررسی", hint: "در دست کارشناس", icon: ManageSearchOutlinedIcon, theme: theme("indigo", "violet") },
  { key: "waiting_customer", label: "منتظر مشتری", hint: "منتظر پاسخ مشتری", icon: HourglassEmptyOutlinedIcon, theme: theme("fuchsia", "purple") },
  { key: "resolved", label: "بسته‌شده", hint: "تیکت‌های بسته‌شده", icon: TaskAltOutlinedIcon, theme: theme("emerald", "green") },
  { key: "", countKey: "all", label: "همه", hint: "همه تیکت‌ها", icon: AllInboxOutlinedIcon, theme: theme("slate", "gray") },
];

// کلاس‌های پویا باید در بیلد Tailwind باشند؛ این لیست آن‌ها را برای اسکنر Tailwind نگه می‌دارد:
// border-orange-200/80 from-orange-50 to-amber-50/50 text-orange-800 hover:border-orange-300 border-orange-400 from-orange-500 to-amber-600 shadow-orange-200/70 bg-orange-100 text-orange-600 bg-orange-500
// border-sky-200/80 from-sky-50 to-blue-50/50 text-sky-800 hover:border-sky-300 border-sky-400 from-sky-500 to-blue-600 shadow-sky-200/70 bg-sky-100 text-sky-600 bg-sky-500
// border-indigo-200/80 from-indigo-50 to-violet-50/50 text-indigo-800 hover:border-indigo-300 border-indigo-400 from-indigo-500 to-violet-600 shadow-indigo-200/70 bg-indigo-100 text-indigo-600 bg-indigo-500
// border-fuchsia-200/80 from-fuchsia-50 to-purple-50/50 text-fuchsia-800 hover:border-fuchsia-300 border-fuchsia-400 from-fuchsia-500 to-purple-600 shadow-fuchsia-200/70 bg-fuchsia-100 text-fuchsia-600 bg-fuchsia-500
// border-emerald-200/80 from-emerald-50 to-green-50/50 text-emerald-800 hover:border-emerald-300 border-emerald-400 from-emerald-500 to-green-600 shadow-emerald-200/70 bg-emerald-100 text-emerald-600 bg-emerald-500
// border-slate-200/80 from-slate-50 to-gray-50/50 text-slate-800 hover:border-slate-300 border-slate-400 from-slate-500 to-gray-600 shadow-slate-200/70 bg-slate-100 text-slate-600 bg-slate-500

function TicketStatusTabs({ status, counts = {}, onChange }) {
  return (
    <div className="purchase-status-tabs-wrap !mb-0">
      <div className="purchase-status-tabs-grid lg:!grid-cols-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = status === tab.key;
          const count = counts[tab.countKey || tab.key] ?? 0;
          return (
            <button
              key={tab.key || "all"}
              type="button"
              onClick={() => onChange(tab.key)}
              title={tab.hint}
              className={`purchase-status-tab border transition-all duration-200 ${isActive ? tab.theme.active : tab.theme.idle}`}
            >
              <span className="relative">
                <span className={`purchase-status-tab-icon ${isActive ? "bg-white/20 text-white" : tab.theme.iconIdle}`}>
                  <Icon sx={{ fontSize: 18 }} />
                </span>
                {count > 0 && (
                  <span className={`purchase-status-tab-count ${isActive ? tab.theme.countActive : tab.theme.countIdle}`}>
                    {count.toLocaleString("fa")}
                  </span>
                )}
              </span>
              <span className="purchase-status-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TicketStatusTabs;
