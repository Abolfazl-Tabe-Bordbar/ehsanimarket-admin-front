import React from "react";
import Main from "@/components/templates/P-Admin/Asnaf/Main";
import getAsnaf from "@/funcs/getAsnaf";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - دسته بندی ها",
};

async function Asnaf() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getAsnaf(token?.value);

  return <Main data={data} />;
}

export default Asnaf;
