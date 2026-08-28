import React from "react";
import { cookies } from "next/headers";
import isLogin from "@/funcs/isLogin";
import NavbarInner from "./NavbarInner";

async function Navbar() {
  const adminInfos = await isLogin(
    (await cookies()).get("ramian-pakhsh-admin")?.value
  );

  return (
    <NavbarInner
      adminName={adminInfos?.name || ""}
      adminFamily={adminInfos?.family || ""}
    />
  );
}

export default Navbar;
