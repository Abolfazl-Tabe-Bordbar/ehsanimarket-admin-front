"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import getCookie from "@/funcs/cookies/getCookie";
import isLogin from "@/funcs/isLogin";
import AdminNavList from "@/components/admin/ui/AdminNavList";
import { getNavItemByPath } from "@/components/admin/navConfig";

function SidebarDropdown() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const currentItem = getNavItemByPath(pathname);
  const CurrentIcon = currentItem?.icon;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    isLogin(getCookie("ramian-pakhsh-admin")).then((res) => {
      setOrdersCount(res?.orders || 0);
    });
  }, []);

  return (
    <div className="md:hidden px-4 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-2xl bg-brand-navy text-white px-4 py-3.5 shadow-md shadow-brand-navy/20"
      >
        <div className="flex items-center gap-2.5 text-sm font-bold">
          {CurrentIcon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <CurrentIcon fontSize="small" />
            </span>
          )}
          {currentItem?.label || "منوی پنل"}
        </div>
        <span
          className={`transition-transform duration-200 ${isOpen ? "rotate-90" : "-rotate-90"}`}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[900px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-2xl bg-brand-navy-dark p-3 shadow-lg border border-white/5">
          <AdminNavList
            badgeCount={ordersCount}
            onNavigate={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default SidebarDropdown;
