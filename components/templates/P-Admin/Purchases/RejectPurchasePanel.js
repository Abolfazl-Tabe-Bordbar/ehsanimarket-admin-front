"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import changePurchaseStatus from "@/funcs/changePurchaseStatus";
import Loader from "@/components/modules/Loader";

function RejectPurchasePanel({
  purchaseInfo,
  rejectionReasons = [],
  onClose,
  onSuccess,
}) {
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedReason = rejectionReasons.find(
    (reason) => String(reason.id) === String(selectedReasonId)
  );

  const handleSubmit = () => {
    if (!selectedReason) {
      setError("لطفاً یکی از دلایل رد را انتخاب کنید.");
      return;
    }

    setError("");
    setIsLoading(true);
    changePurchaseStatus({
      orderId: purchaseInfo.id,
      rejection_reason_id: selectedReason.id,
      new_order_status: 2,
    }).then(() => {
      setIsLoading(false);
      onSuccess?.();
      onClose?.();
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="mt-3 rounded-2xl border border-red-100 bg-gradient-to-b from-red-50/80 to-white p-4 md:p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <BlockOutlinedIcon fontSize="small" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-bold text-brand-navy">
                دلیل رد خرید را انتخاب کنید
              </h3>
              <p className="mt-1 text-xs md:text-sm text-gray-500 leading-6">
                برای هر دلیل، پیام داخلی و پیام کاربر جداگانه ثبت شده است.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 shrink-0"
            onClick={onClose}
            aria-label="بستن"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {rejectionReasons.map((reason) => {
            const isSelected = String(selectedReasonId) === String(reason.id);

            return (
              <button
                key={reason.id}
                type="button"
                onClick={() => {
                  setSelectedReasonId(String(reason.id));
                  setError("");
                }}
                className={`rounded-xl border px-4 py-3 text-right transition-all ${
                  isSelected
                    ? "border-red-300 bg-white shadow-sm ring-2 ring-red-200"
                    : "border-gray-200 bg-white/80 hover:border-red-200 hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-bold text-brand-navy leading-6">
                      {reason.admin_message}
                    </p>
                    <p className="text-xs text-gray-500 leading-5 line-clamp-2">
                      {reason.user_message}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedReason ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-3">
              <StorefrontOutlinedIcon
                sx={{ fontSize: 18 }}
                className="text-amber-700 mt-0.5"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-navy">
                  پیام مدیریت و بخش فروش
                </p>
                <p className="mt-1 text-sm text-gray-600 leading-6">
                  {selectedReason.admin_message}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-3">
              <InfoOutlinedIcon sx={{ fontSize: 18 }} className="text-brand-blue mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-navy">پیام کاربر</p>
                <p className="mt-1 text-sm text-gray-600 leading-6">
                  {selectedReason.user_message}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="admin-btn !bg-red-600 !text-white hover:!bg-red-700 !py-2 !px-5 text-sm"
            onClick={handleSubmit}
          >
            تأیید رد خرید
          </button>
          <button
            type="button"
            className="admin-btn-secondary !py-2 !px-5 text-sm"
            onClick={onClose}
          >
            انصراف
          </button>
        </div>
      </div>
    </>
  );
}

export default RejectPurchasePanel;
