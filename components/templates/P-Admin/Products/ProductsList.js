"use client";
import React, { useEffect, useState } from "react";
import ProductBox from "./ProductBox";
import ProductFilters from "./ProductFilters";
import CustomPagination from "@/components/modules/CustomPagination";
import EmptyMessage from "@/components/modules/EmptyMessage";
import AdminSearchBar from "@/components/admin/ui/AdminSearchBar";
import getProducts from "@/funcs/getProducts";
import { useSearchParams, useRouter } from "next/navigation";
import getCookie from "@/funcs/cookies/getCookie";
import getSearchProducts from "@/funcs/getSearchProducts";
import {
  buildProductsFilterQuery,
  getProductsFiltersFromParams,
  hasActiveProductFilters,
} from "./productFilterHelpers";

function ProductsList({ data, asnaf = [], brands = [] }) {
  const [shownData, setShownData] = useState(data);

  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(shownData?.countAll / itemsPerPage);
  const filters = getProductsFiltersFromParams(searchParams);
  const searchValue = filters.q;
  const filterQuery = buildProductsFilterQuery(searchParams);
  const [searchInput, setSearchInput] = useState(searchValue);

  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  const fetchProducts = () => {
    const page = Number(searchParams.get("p")) ? Number(searchParams.get("p")) - 1 : 0;
    const apiFilters = {
      senf_id: filters.senf_id,
      subcategory_id: filters.subcategory_id,
      brand_id: filters.brand_id,
      stock: filters.stock,
      discount: filters.discount,
    };

    if (searchValue.trim()) {
      getSearchProducts({ name: searchValue.trim() }, page, itemsPerPage, apiFilters).then(
        (res) => {
          setShownData({
            status: res?.status,
            body: res?.body?.rows,
            countAll: res?.body?.count,
          });
        }
      );
      return;
    }

    getProducts(getCookie("ramian-pakhsh-admin"), page, itemsPerPage, apiFilters).then(
      (res) => setShownData(res)
    );
  };

  const searchProductHandler = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    params.set("p", "1");
    router.push(`/p-admin/products?${params.toString()}`);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    if (totalPages === 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("p", "1");
      router.push(`/p-admin/products?${params.toString()}`);
    } else if (Number(searchParams.get("p")) > totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("p", String(totalPages));
      router.push(`/p-admin/products?${params.toString()}`);
    }
  }, [shownData]);

  const isSearching = Boolean(searchValue.trim());
  const isFiltering = hasActiveProductFilters(filters);

  return (
    <div className="my-6 space-y-6">
      <ProductFilters asnaf={asnaf} brands={brands} />

      <AdminSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={searchProductHandler}
        onClear={() => searchProductHandler("")}
        placeholder="جستجو در نام محصول..."
      />

      {!shownData?.body?.length ? (
        <EmptyMessage
          text={
            isSearching || isFiltering
              ? "محصولی با این فیلتر یافت نشد."
              : "هیچ محصولی ثبت نشده است."
          }
        />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {Number(shownData?.countAll || 0).toLocaleString("fa-IR")} محصول
          </p>
          <div className="admin-list">
            {shownData?.body?.map((product) => (
              <ProductBox
                key={product.id}
                {...product}
                getProductsHandler={fetchProducts}
              />
            ))}
          </div>
          <CustomPagination
            currentPage={Number(searchParams.get("p")) || 1}
            totalPages={totalPages}
            extraQuery={filterQuery}
          />
        </>
      )}
    </div>
  );
}

export default ProductsList;
