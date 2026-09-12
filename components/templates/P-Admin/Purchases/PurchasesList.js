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
import {
  purchaseMessageStageByTab,
  purchaseTabToStatusAfterPaid,
} from "./purchaseHelpers";

const emptyMessages = {
  pending: "خرید در انتظار تایید وجود ندارد.",
  preparing: "سفارشی در حال آماده‌سازی نیست.",
  shipping: "سفارشی در حال ارسال نیست.",
  shipped: "سفارش ارسال‌شده‌ای وجود ندارد.",
  "not-send": "سفارش رد‌شده‌ای وجود ندارد.",
};

function PurchasesList({ purchases, tabStatus }) {
  const [shownData, setShownData] = useState(purchases);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [stageMessages, setStageMessages] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsPerPage = 5;
  const totalPages = Math.ceil((shownData?.countAll || 0) / itemsPerPage);
  const statusAfterPaid = purchaseTabToStatusAfterPaid[tabStatus];
  const messageStage = purchaseMessageStageByTab[tabStatus];

  const getPurchasesHandler = () => {
    getPurchases(
      getCookie("ramian-pakhsh-admin"),
      Number(searchParams.get("p")) ? Number(searchParams.get("p")) - 1 : 0,
      itemsPerPage,
      statusAfterPaid
    ).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    getPurchasesHandler();
  }, [searchParams, tabStatus]);

  useEffect(() => {
    if (tabStatus === "pending") {
      getRejectionReasons(getCookie("ramian-pakhsh-admin")).then((res) => {
        setRejectionReasons(res?.body || []);
      });
    }

    if (messageStage) {
      getApprovalMessages(getCookie("ramian-pakhsh-admin"), messageStage).then((res) => {
        setStageMessages(res?.body || []);
      });
    } else {
      setStageMessages([]);
    }
  }, [tabStatus, messageStage]);

  useEffect(() => {
    if (!totalPages) return;

    const currentPage = Number(searchParams.get("p")) || 1;
    if (currentPage > totalPages) {
      router.replace(`/p-admin/purchases?p=${totalPages}&status=${tabStatus}`);
    }
  }, [shownData, tabStatus, totalPages, searchParams, router]);

  return (
    <div className="mt-6">
      {shownData?.data?.length ? (
        <>
          <div className="admin-list">
            {shownData.data.map((purchase) => (
              <PurchaseBox
                key={purchase.id}
                purchaseInfo={purchase}
                status={tabStatus}
                getPurchasesHandler={getPurchasesHandler}
                rejectionReasons={rejectionReasons}
                approvalMessages={tabStatus === "pending" ? stageMessages : []}
                stageMessages={messageStage ? stageMessages : []}
              />
            ))}
          </div>
          <CustomPagination
            currentPage={Number(searchParams.get("p")) || 1}
            totalPages={totalPages}
            status={tabStatus}
          />
        </>
      ) : (
        <EmptyMessage text={emptyMessages[tabStatus] || "موردی یافت نشد."} />
      )}
    </div>
  );
}

export default PurchasesList;
