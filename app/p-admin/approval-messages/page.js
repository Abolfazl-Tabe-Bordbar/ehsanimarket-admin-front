import React from "react";
import { cookies } from "next/headers";
import getApprovalMessages from "@/funcs/getApprovalMessages";
import Main from "@/components/templates/P-Admin/ApprovalMessages/Main";

export const metadata = {
  title: "احسانی مارکت - پیام‌های سفارش",
};

async function page({ searchParams }) {
  const params = await searchParams;
  const stage = params?.stage || "approve";
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getApprovalMessages(token?.value, stage);

  return <Main data={data} stage={stage} />;
}

export default page;
