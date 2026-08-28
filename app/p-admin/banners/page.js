import React from "react";
import Main from "@/components/templates/P-Admin/Banners/Main";
import { cookies } from "next/headers";
import getBanners from "@/funcs/getBanners";

export const metadata = {
  title: "احسانی مارکت - بنر ها",
};

async function Banners() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getBanners(token?.value);

  return <Main data={data} />;
}

export default Banners;
