import React from "react";
import { cookies } from "next/headers";
import getAdmins from "@/funcs/getAdmins";
import getPermissions from "@/funcs/getPermissions";
import Main from "@/components/templates/P-Admin/Admins/Main";

export const metadata = {
  title: "احسانی مارکت - مدیریت ادمین ها",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const adminsData = await getAdmins(token?.value);
  const permissionsData = await getPermissions(token?.value);

  return <Main adminsData={adminsData} permissionsData={permissionsData} />;
}

export default page;
