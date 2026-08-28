"use client";
import React, { useEffect, useState } from "react";
import ProductBox from "./ProductBox";
import CustomPagination from "@/components/modules/CustomPagination";
import EmptyMessage from "@/components/modules/EmptyMessage";
import AdminSearchBar from "@/components/admin/ui/AdminSearchBar";
import getProducts from "@/funcs/getProducts";
import { useSearchParams, useRouter } from "next/navigation";
import getCookie from "@/funcs/cookies/getCookie";
import getSearchProducts from "@/funcs/getSearchProducts";

function ProductsList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [searchValue, setSearchValue] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(shownData?.countAll / itemsPerPage);

  const getProductsHandler = () => {
    getProducts(
      getCookie("ramian-pakhsh-admin"),
      Number(searchParams.get("p")) ? Number(searchParams.get("p")) - 1 : 0,
      itemsPerPage
    ).then((res) => {
      setShownData(res);
    });
  };

  const searchProductHandler = (value) => {
    getSearchProducts(
      { name: value },
      Number(searchParams.get("p")) ? Number(searchParams.get("p")) - 1 : 0,
      itemsPerPage
    ).then((res) => {
      setShownData({
        status: res.status,
        body: res?.body?.rows,
        countAll: res?.body?.count,
      });
    });
  };

  useEffect(() => {
    if (searchValue) {
      searchProductHandler(searchValue);
    } else {
      getProductsHandler();
    }
  }, [searchParams]);

  useEffect(() => {
    if (totalPages == 0) {
      router.push(`/p-admin/products?p=1`);
    } else {
      if (searchParams.get("p") > totalPages) {
        router.push(`/p-admin/products?p=${totalPages}`);
      }
    }
  }, [shownData]);

  const isSearching = Boolean(searchValue.trim());

  return (
    <div className="my-6">
      <AdminSearchBar
        className="mb-6"
        value={searchValue}
        onChange={setSearchValue}
        onSearch={searchProductHandler}
        onClear={() => {
          setSearchValue("");
          getProductsHandler();
        }}
        placeholder="جستجو در نام محصول..."
      />
      {!shownData?.body?.length ? (
        <EmptyMessage
          text={
            isSearching
              ? "محصولی با این عبارت یافت نشد."
              : "هیچ محصولی ثبت نشده است."
          }
        />
      ) : (
        <>
          <div className="admin-list">
            {shownData?.body?.map((product) => (
              <ProductBox
                key={product.id}
                {...product}
                getProductsHandler={getProductsHandler}
              />
            ))}
          </div>
          <div>
            <CustomPagination
              currentPage={Number(searchParams.get("p")) || 1}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductsList;
