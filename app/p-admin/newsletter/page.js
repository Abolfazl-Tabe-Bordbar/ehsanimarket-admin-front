import React from "react";
import { cookies } from "next/headers";
import getNewsletterSubscribers from "@/funcs/getNewsletterSubscribers";
import Main from "@/components/templates/P-Admin/Newsletter/Main";

export const metadata = {
  title: "احسانی مارکت - خبرنامه مقالات",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getNewsletterSubscribers(token?.value);

  return <Main data={data} />;
}

export default page;
