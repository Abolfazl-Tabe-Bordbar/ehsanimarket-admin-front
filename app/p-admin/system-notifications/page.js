import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import AdminsPhone from "@/components/templates/P-Admin/System_Notifications/AdminsPhone";
import KavenegarBalance from "@/components/templates/P-Admin/System_Notifications/KavenegarBalance";
import SystemNotifications from "@/components/templates/P-Admin/System_Notifications/SystemNotifications";
import getAdminsPhone from "@/funcs/getAdminsPhone";
import getKavenegarBalance from "@/funcs/getKavenegarBalance";
import getSystemMessages from "@/funcs/getSystemMessages";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - اعلان های سایت",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const kavenegarBalance = await getKavenegarBalance(token?.value);
  const adminsPhone = await getAdminsPhone(token?.value);
  const systemMessages = await getSystemMessages(token?.value);

  return (
    <AdminPageShell
      title="مدیریت پیام‌ها"
      description="تنظیم پیامک‌های سیستمی و شماره مدیران"
    >
      <div className="space-y-8">
        <KavenegarBalance kavenegarBalance={kavenegarBalance} />
        <AdminsPhone adminsPhone={adminsPhone} />
        <SystemNotifications systemMessages={systemMessages} />
      </div>
    </AdminPageShell>
  );
}

export default page;
