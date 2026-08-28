import React from "react";
import Main from "@/components/templates/P-Admin/Purchases/Main";
import { cookies } from "next/headers";
import getPurchases from "@/funcs/getPurchases";

export const metadata = {
  title: "احسانی مارکت - خرید ها",
};

async function Purchases({ searchParams }) {
  const status = (await searchParams)?.status
    ? (await searchParams).status
    : "pending";
  const token = (await cookies()).get("ramian-pakhsh-admin")?.value;

  const pendingPurchases = await getPurchases(token, 0, 5, 0);
  const sendPurchases = await getPurchases(token, 0, 5, 1);
  const notSendPurchases = await getPurchases(token, 0, 5, 2);

  return (
    <Main
      status={status}
      pendingPurchases={pendingPurchases}
      sendPurchases={sendPurchases}
      notSendPurchases={notSendPurchases}
    />
  );
}

export default Purchases;
