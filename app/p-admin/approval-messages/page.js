import React from "react";
import { cookies } from "next/headers";
import getApprovalMessages from "@/funcs/getApprovalMessages";
import Main from "@/components/templates/P-Admin/ApprovalMessages/Main";

export const metadata = {
  title: "احسانی مارکت - پیام‌های تأیید سفارش",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getApprovalMessages(token?.value);

  return <Main data={data} />;
}

export default page;
