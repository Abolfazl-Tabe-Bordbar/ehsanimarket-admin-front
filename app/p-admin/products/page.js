import React from "react";
import Main from "@/components/templates/P-Admin/Products/Main";
import { cookies } from "next/headers";
import getProducts from "@/funcs/getProducts";
import getAsnaf from "@/funcs/getAsnaf";
import getBrands from "@/funcs/getBrands";

export const metadata = {
  title: "احسانی مارکت - محصولات",
};

async function Products({ searchParams }) {
  const params = await searchParams;
  const token = (await cookies()).get("ramian-pakhsh-admin")?.value;
  const page = Number(params.p) ? Number(params.p) - 1 : 0;

  const filters = {
    senf_id: params.senf || "",
    subcategory_id: params.subcategory || "",
    brand_id: params.brand || "",
    stock: params.stock || "",
    discount: params.discount || "",
    pending_comments: params.pending_comments || "",
  };

  const [data, asnafData, brandsData] = await Promise.all([
    getProducts(token, page, 10, filters),
    getAsnaf(token),
    getBrands(token),
  ]);

  return (
    <Main
      data={data}
      asnaf={asnafData?.body || []}
      brands={brandsData?.body || []}
    />
  );
}

export default Products;
