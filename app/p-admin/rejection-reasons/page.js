import React from "react";
import { cookies } from "next/headers";
import getRejectionReasons from "@/funcs/getRejectionReasons";
import Main from "@/components/templates/P-Admin/RejectionReasons/Main";

export const metadata = {
  title: "احسانی مارکت - دلایل رد خرید",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getRejectionReasons(token?.value);

  return <Main data={data} />;
}

export default page;
