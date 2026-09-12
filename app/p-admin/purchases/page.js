import React from "react";
import Main from "@/components/templates/P-Admin/Purchases/Main";
import { cookies } from "next/headers";
import getPurchases from "@/funcs/getPurchases";

export const metadata = {
  title: "احسانی مارکت - خرید ها",
};

async function Purchases({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "pending";
  const token = (await cookies()).get("ramian-pakhsh-admin")?.value;

  const [pendingPurchases, preparingPurchases, shippingPurchases, shippedPurchases, notSendPurchases] =
    await Promise.all([
      getPurchases(token, 0, 5, 0),
      getPurchases(token, 0, 5, 1),
      getPurchases(token, 0, 5, 3),
      getPurchases(token, 0, 5, 4),
      getPurchases(token, 0, 5, 2),
    ]);

  const purchasesByStatus = {
    pending: pendingPurchases,
    preparing: preparingPurchases,
    shipping: shippingPurchases,
    shipped: shippedPurchases,
    "not-send": notSendPurchases,
  };

  return <Main status={status} purchasesByStatus={purchasesByStatus} />;
}

export default Purchases;
