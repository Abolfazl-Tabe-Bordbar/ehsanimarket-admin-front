import React from "react";
import Main from "@/components/templates/P-Admin/Products/Main";
import { cookies } from "next/headers";
import getProducts from "@/funcs/getProducts";

export const metadata = {
  title: "احسانی مارکت - محصولات",
};

async function Products({ searchParams }) {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getProducts(
    token?.value,
    Number((await searchParams).p) ? Number((await searchParams).p) - 1 : 0,
    10
  );

  return <Main data={data} />;
}

export default Products;
