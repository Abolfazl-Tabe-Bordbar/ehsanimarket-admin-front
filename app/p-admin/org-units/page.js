import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import OrgUnitsClient from "@/components/templates/P-Admin/OrgUnits/OrgUnitsClient";
import getOrgUnits from "@/funcs/getOrgUnits";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - واحدهای سازمان",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getOrgUnits(token?.value);

  return (
    <AdminPageShell
      title="واحدهای سازمان"
      description="تعریف واحدهایی مثل مالی و فروش، و اتصال مدیران به آن‌ها"
    >
      <OrgUnitsClient initialUnits={data?.body || []} />
    </AdminPageShell>
  );
}

export default page;
