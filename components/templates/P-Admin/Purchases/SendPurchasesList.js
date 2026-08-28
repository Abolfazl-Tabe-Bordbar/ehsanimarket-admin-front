"use client";
import React, { useEffect, useState } from "react";
import PurchaseBox from "./PurchaseBox";
import EmptyMessage from "@/components/modules/EmptyMessage";
import { useRouter, useSearchParams } from "next/navigation";
import getPurchases from "@/funcs/getPurchases";
import CustomPagination from "@/components/modules/CustomPagination";
import getCookie from "@/funcs/cookies/getCookie";

function SendPurchasesList({ purchases }) {
  const [shownData, setShownData] = useState(purchases);

  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(shownData?.countAll / itemsPerPage);

  const getPurchasesHandler = () => {
    getPurchases(
      getCookie("ramian-pakhsh-admin"),
      Number(searchParams.get("p")) ? Number(searchParams.get("p")) - 1 : 0,
      itemsPerPage,
      1
    ).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    getPurchasesHandler();
  }, [searchParams]);

  useEffect(() => {
    if (totalPages == 0) {
      router.push(`/p-admin/purchases?p=1&status=send`);
    } else {
      if (searchParams.get("p") > totalPages) {
        router.push(`/p-admin/purchases?p=${totalPages}&status=send`);
      }
    }
  }, [shownData]);

  return (
    <div className="mt-6">
      {shownData?.data?.length ? (
        <>
          <div className="admin-list">
            {shownData?.data?.map((purchase) => (
              <PurchaseBox
                key={purchase.id}
                purchaseInfo={purchase}
                status="send"
              />
            ))}
          </div>
          <div>
            <CustomPagination
              currentPage={Number(searchParams.get("p")) || 1}
              totalPages={totalPages}
              status="send"
            />
          </div>
        </>
      ) : (
        <EmptyMessage text="خرید ارسال شده ای وجود ندارد." />
      )}
    </div>
  );
}

export default SendPurchasesList;
