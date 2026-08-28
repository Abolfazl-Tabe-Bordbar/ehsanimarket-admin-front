"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import getCookie from "@/funcs/cookies/getCookie";
import isLogin from "@/funcs/isLogin";
import AdminNavList from "@/components/admin/ui/AdminNavList";

function Sidebar() {
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    isLogin(getCookie("ramian-pakhsh-admin")).then((res) => {
      setOrdersCount(res?.orders || 0);
    });
  }, []);

  return (
    <aside className="hidden md:flex md:w-[260px] lg:w-[272px] shrink-0 flex-col bg-brand-navy-dark border-l border-white/5 h-screen sticky top-0">
      <div className="border-b border-white/10 py-5 px-6">
        <Image
          src="/images/logo-1.png"
          alt="احسانی مارکت"
          width={110}
          height={58}
          className="mx-auto brightness-0 invert opacity-95"
        />
        <p className="text-center text-[11px] text-white/40 mt-2 tracking-wide">
          پنل مدیریت
        </p>
      </div>
      <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
        <AdminNavList badgeCount={ordersCount} />
      </nav>
      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-[11px] text-white/35 text-center leading-relaxed">
          احسانی مارکت
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
