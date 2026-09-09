import React from "react";
import { cookies } from "next/headers";
import getShippingRates from "@/funcs/getShippingRates";
import Main from "@/components/templates/P-Admin/ShippingRates/Main";

export const metadata = {
  title: "احسانی مارکت - هزینه پست شهرها",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getShippingRates(token?.value);

  return <Main data={data} />;
}

export default page;
