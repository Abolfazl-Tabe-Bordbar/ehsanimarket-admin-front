import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import SmsEventsClient from "@/components/templates/P-Admin/SmsEvents/SmsEventsClient";
import getSystemMessages from "@/funcs/getSystemMessages";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - مدیریت ایونت‌های SMS",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const systemMessages = await getSystemMessages(token?.value);

  return (
    <AdminPageShell
      title="مدیریت ایونت‌های SMS"
      description="فعال یا غیرفعال کردن ارسال پیامک برای هر رویداد سیستمی"
    >
      <SmsEventsClient systemMessages={systemMessages} />
    </AdminPageShell>
  );
}

export default page;
