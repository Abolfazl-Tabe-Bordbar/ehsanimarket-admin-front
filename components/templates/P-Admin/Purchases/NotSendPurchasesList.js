"use client";
import React, { useEffect, useState } from "react";
import PurchaseBox from "./PurchaseBox";
import EmptyMessage from "@/components/modules/EmptyMessage";
import { useRouter, useSearchParams } from "next/navigation";
import getPurchases from "@/funcs/getPurchases";
import getRejectionReasons from "@/funcs/getRejectionReasons";
import CustomPagination from "@/components/modules/CustomPagination";
import getCookie from "@/funcs/cookies/getCookie";

function NotSendPurchasesList({ purchases }) {
  const [shownData, setShownData] = useState(purchases);
  const [rejectionReasons, setRejectionReasons] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(shownData?.countAll / itemsPerPage);
  const selectedReasonId = searchParams.get("reason") || "";

  const getPurchasesHandler = () => {
    getPurchases(
      getCookie("ramian-pakhsh-admin"),
      Number(searchParams.get("p")) ? Number(searchParams.get("p")) - 1 : 0,
      itemsPerPage,
      2,
      selectedReasonId || null
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
  }, []);

  useEffect(() => {
    if (totalPages == 0) {
      router.push(
        `/p-admin/purchases?p=1&status=not-send${
          selectedReasonId ? `&reason=${selectedReasonId}` : ""
        }`
      );
    } else if (searchParams.get("p") > totalPages) {
      router.push(
        `/p-admin/purchases?p=${totalPages}&status=not-send${
          selectedReasonId ? `&reason=${selectedReasonId}` : ""
        }`
      );
    }
  }, [shownData]);

  const handleReasonFilterChange = (event) => {
    const reason = event.target.value;
    const query = reason
      ? `/p-admin/purchases?p=1&status=not-send&reason=${reason}`
      : "/p-admin/purchases?p=1&status=not-send";
    router.push(query);
  };

  const paginationExtraQuery = selectedReasonId
    ? `&reason=${selectedReasonId}`
    : "";

  return (
    <div className="mt-6 space-y-4">
      <div className="admin-card px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-brand-navy">فیلتر بر اساس دلیل رد</p>
          <p className="text-xs text-gray-500 mt-1">
            فقط خریدهای ارسال‌نشده با دلیل انتخاب‌شده نمایش داده می‌شوند.
          </p>
        </div>
        <select
          value={selectedReasonId}
          onChange={handleReasonFilterChange}
          className="border rounded-xl px-3 py-2 text-sm min-w-[220px] outline-gray-300"
        >
          <option value="">همه دلایل رد</option>
          {rejectionReasons.map((reason) => (
            <option key={reason.id} value={reason.id}>
              {reason.admin_message}
            </option>
          ))}
        </select>
      </div>

      {shownData?.data?.length ? (
        <>
          <div className="admin-list">
            {shownData.data.map((purchase) => (
              <PurchaseBox
                key={purchase.id}
                purchaseInfo={purchase}
                status="not-send"
              />
            ))}
          </div>
          <CustomPagination
            currentPage={Number(searchParams.get("p")) || 1}
            totalPages={totalPages}
            status="not-send"
            extraQuery={paginationExtraQuery}
          />
        </>
      ) : (
        <EmptyMessage text="خرید ارسال نشده‌ای با این فیلتر وجود ندارد." />
      )}
    </div>
  );
}

export default NotSendPurchasesList;
