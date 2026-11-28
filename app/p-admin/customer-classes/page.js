import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import CustomerClassesClient from "@/components/templates/P-Admin/CustomerClasses/CustomerClassesClient";
import getCustomerClassesAdmin from "@/funcs/getCustomerClassesAdmin";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - کلاس‌های مشتری",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getCustomerClassesAdmin(token?.value);

  return (
    <AdminPageShell
      title="کلاس‌های مشتری"
      description="تعریف سطح مشتری با درصد تخفیف از قیمت پایه محصول و اختصاص به کاربران در جزئیات هر کاربر"
    >
      <CustomerClassesClient initialClasses={data?.body || []} />
    </AdminPageShell>
  );
}

export default page;