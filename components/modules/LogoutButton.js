"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import deleteCookie from "@/funcs/cookies/deleteCookie";

function LogoutButton() {
  const router = useRouter();

  function logoutHandler() {
    deleteCookie("ramian-pakhsh-admin");
    router.push("/");
  }

  return (
    <button
      type="button"
      className="admin-btn-ghost !px-2.5 !py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={logoutHandler}
      title="خروج"
    >
      <p className="hidden xs:block text-sm">خروج</p>
      <LogoutIcon sx={{ fontSize: 20 }} className="rotate-180" />
    </button>
  );
}

export default LogoutButton;
