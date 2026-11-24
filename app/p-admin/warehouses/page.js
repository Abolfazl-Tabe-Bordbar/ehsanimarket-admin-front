import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import WarehousesClient from "@/components/templates/P-Admin/Warehouses/WarehousesClient";
import getWarehouses from "@/funcs/getWarehouses";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - انبارها",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getWarehouses(token?.value);

  return (
    <AdminPageShell title="انبارها" description="تعریف انبار با نام و کد، و فعال یا غیرفعال کردن هر انبار">
      <WarehousesClient initialRows={data?.body || []} />
    </AdminPageShell>
  );
}

export default page;