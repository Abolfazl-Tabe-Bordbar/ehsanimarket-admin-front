import React from "react";
import Main from "@/components/templates/P-Admin/Subcategories/Main";
import { cookies } from "next/headers";
import getSubcategories from "@/funcs/getSubcategories";

export const metadata = {
  title: "احسانی مارکت - زیردسته ها",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getSubcategories(token?.value);

  return <Main data={data} />;
}

export default page;
