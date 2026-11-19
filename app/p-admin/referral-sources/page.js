import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import ReferralSourcesClient from "@/components/templates/P-Admin/ReferralSources/ReferralSourcesClient";
import getReferralSourcesAdmin from "@/funcs/getReferralSourcesAdmin";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - نحوه آشنایی کاربران",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getReferralSourcesAdmin(token?.value);

  return (
    <AdminPageShell
      title="نحوه آشنایی با ما"
      description="گزینه‌هایی که کاربر در پروفایل برای «از کجا با ما آشنا شدید» انتخاب می‌کند"
    >
      <ReferralSourcesClient initialSources={data?.body || []} otherCount={data?.otherCount || 0} />
    </AdminPageShell>
  );
}

export default page;
