import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import UserSmsClient from "@/components/templates/P-Admin/UserSms/UserSmsClient";
import KavenegarBalance from "@/components/templates/P-Admin/System_Notifications/KavenegarBalance";
import getUserTags from "@/funcs/getUserTags";
import getUserSmsBroadcasts from "@/funcs/getUserSmsBroadcasts";
import getKavenegarBalance from "@/funcs/getKavenegarBalance";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - ارسال پیامک به کاربران",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const [tagsData, broadcastsData, kavenegarBalance] = await Promise.all([
    getUserTags(token?.value),
    getUserSmsBroadcasts(token?.value, 0, 10),
    getKavenegarBalance(token?.value),
  ]);

  return (
    <AdminPageShell
      title="ارسال پیامک به کاربران"
      description="انتخاب کاربران بر اساس تگ یا به‌صورت تکی و ارسال پیامک"
      actions={<KavenegarBalance kavenegarBalance={kavenegarBalance} />}
    >
      <UserSmsClient
        initialTags={tagsData?.body || []}
        initialBroadcasts={broadcastsData?.body || []}
        initialBroadcastsCount={broadcastsData?.countAll || 0}
      />
    </AdminPageShell>
  );
}

export default page;
