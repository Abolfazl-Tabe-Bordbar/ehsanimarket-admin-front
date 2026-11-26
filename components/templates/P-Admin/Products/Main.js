import React from "react";
import ProductsPageClient from "@/components/templates/P-Admin/Products/ProductsPageClient";

function Main({ data, asnaf = [], brands = [] }) {
  return <ProductsPageClient data={data} asnaf={asnaf} brands={brands} />;
}

export default Main;