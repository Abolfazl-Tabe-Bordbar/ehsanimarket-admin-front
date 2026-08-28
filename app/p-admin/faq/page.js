import React from "react";
import { cookies } from "next/headers";
import getFaqs from "@/funcs/getFaqs";
import Main from "@/components/templates/P-Admin/Faq/Main";

export const metadata = {
  title: "احسانی مارکت - سوالات متداول",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getFaqs(token?.value);

  return <Main data={data} />;
}

export default page;
