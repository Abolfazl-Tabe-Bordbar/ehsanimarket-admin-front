"use client";

import React from "react";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import LogoutButton from "./LogoutButton";
import ChangePasswordButton from "./ChangePasswordButton";
import NavbarQuickLinks from "./NavbarQuickLinks";
import { uploadUrl } from "@/data/variables";

function NavbarInner({ adminName, adminFamily, avatarPath, quickInfo }) {
  const avatarSrc = avatarPath
    ? `${uploadUrl}/${String(avatarPath).replace(/^\//, "")}`
    : null;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-14 md:h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/p-admin/profile"
          className="flex items-center gap-2 rounded-xl bg-brand-gold/10 text-brand-navy px-3 py-2 border border-brand-gold/20 min-w-0 max-w-[50%] sm:max-w-none hover:bg-brand-gold/15 transition-colors"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-gold text-white">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <PersonIcon sx={{ fontSize: 16 }} />
            )}
          </span>
          <p className="text-sm font-medium line-clamp-1">
            {adminName} {adminFamily}
          </p>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <NavbarQuickLinks initial={quickInfo} />
          <ChangePasswordButton />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

export default NavbarInner;
