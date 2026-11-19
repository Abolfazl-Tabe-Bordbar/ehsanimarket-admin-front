"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import getAdminStatus from "@/funcs/getAdminStatus";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function QuickLink({ href, icon: Icon, label, count, tone }) {
  const active = count > 0;
  return (
    <Link
      href={href}
      title={label}
      className={`relative inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-sm transition-colors ${
        active ? tone : "border-gray-200 text-gray-500 hover:bg-gray-50"
      }`}
    >
      <Icon sx={{ fontSize: 20 }} />
      <span className="hidden lg:inline">{label}</span>
      <span
        className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold ${
          active ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {fa(count)}
      </span>
    </Link>
  );
}

// میانبرهای بالای پنل: تیکت‌های خوانده‌نشده و خریدهای جدید (هر دقیقه به‌روز می‌شود)
function NavbarQuickLinks({ initial }) {
  const pathname = usePathname();
  const [info, setInfo] = useState(initial || {});

  useEffect(() => {
    const load = () =>
      getAdminStatus().then((res) => {
        if (res?.status) setInfo(res);
      });
    load();
    const timer = setInterval(load, 60 * 1000);
    return () => clearInterval(timer);
  }, [pathname]);

  const permissions = Array.isArray(info.permissions) ? info.permissions : [];
  const canTickets = permissions.includes("support_agent") || permissions.includes("support_manage");
  const canOrders = permissions.includes("orders_access");

  if (!canTickets && !canOrders) return null;

  return (
    <div className="flex items-center gap-2">
      {canTickets && (
        <QuickLink
          href="/p-admin/tickets"
          icon={ConfirmationNumberOutlinedIcon}
          label="تیکت‌های باز‌نشده"
          count={info.tickets}
          tone="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
        />
      )}
      {canOrders && (
        <QuickLink
          href="/p-admin/purchases?p=1&status=pending"
          icon={ShoppingBasketOutlinedIcon}
          label="خریدهای جدید"
          count={info.orders}
          tone="border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
        />
      )}
    </div>
  );
}

export default NavbarQuickLinks;
