"use client";
import React, { useEffect, useState } from "react";
import PurchaseBox from "./PurchaseBox";
import EmptyMessage from "@/components/modules/EmptyMessage";
import { useRouter, useSearchParams } from "next/navigation";
import getPurchases from "@/funcs/getPurchases";
import getRejectionReasons from "@/funcs/getRejectionReasons";
import getApprovalMessages from "@/funcs/getApprovalMessages";
import CustomPagination from "@/components/modules/CustomPagination";
import getCookie from "@/funcs/cookies/getCookie";

function PendingPurchasesList({ purchases }) {
  const [shownData, setShownData] = useState(purchases);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [approvalMessages, setApprovalMessages] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(shownData?.countAll / itemsPerPage);

  const getPurchasesHandler = () => {
    getPurchases(
      getCookie("ramian-pakhsh-admin"),
      Number(searchParams.get("p")) ? Number(searchParams.get("p")) - 1 : 0,
      itemsPerPage,
      0
    ).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    getPurchasesHandler();
  }, [searchParams]);

  useEffect(() => {
    getRejectionReasons(getCookie("ramian-pakhsh-admin")).then((res) => {
      setRejectionReasons(res?.body || []);
    });
    getApprovalMessages(getCookie("ramian-pakhsh-admin")).then((res) => {
      setApprovalMessages(res?.body || []);
    });
  }, []);

  useEffect(() => {
    if (totalPages == 0) {
      router.push(`/p-admin/purchases?p=1&status=pending`);
    } else {
      if (searchParams.get("p") > totalPages) {
        router.push(`/p-admin/purchases?p=${totalPages}&status=pending`);
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
                status="pending"
                getPurchasesHandler={getPurchasesHandler}
                rejectionReasons={rejectionReasons}
                approvalMessages={approvalMessages}
              />
            ))}
          </div>
          <div>
            <CustomPagination
              currentPage={Number(searchParams.get("p")) || 1}
              totalPages={totalPages}
              status="pending"
            />
          </div>
        </>
      ) : (
        <EmptyMessage text="خرید جاری ای وجود ندارد." />
      )}
    </div>
  );
}

export default PendingPurchasesList;
