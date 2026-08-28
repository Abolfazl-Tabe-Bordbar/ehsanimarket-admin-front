"use client";
import React, { useEffect, useState } from "react";
import PurchaseBox from "./PurchaseBox";
import EmptyMessage from "@/components/modules/EmptyMessage";
import { useRouter, useSearchParams } from "next/navigation";
import getPurchases from "@/funcs/getPurchases";
import CustomPagination from "@/components/modules/CustomPagination";
import getCookie from "@/funcs/cookies/getCookie";

function NotSendPurchasesList({ purchases }) {
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
      2
    ).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    getPurchasesHandler();
  }, [searchParams]);

  useEffect(() => {
    if (totalPages == 0) {
      router.push(`/p-admin/purchases?p=1&status=not-send`);
    } else {
      if (searchParams.get("p") > totalPages) {
        router.push(`/p-admin/purchases?p=${totalPages}&status=not-send`);
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
                status="not-send"
              />
            ))}
          </div>
          <div>
            <CustomPagination
              currentPage={Number(searchParams.get("p")) || 1}
              totalPages={totalPages}
              status="not-send"
            />
          </div>
        </>
      ) : (
        <EmptyMessage text="خرید ارسال نشده ای وجود ندارد." />
      )}
    </div>
  );
}

export default NotSendPurchasesList;
