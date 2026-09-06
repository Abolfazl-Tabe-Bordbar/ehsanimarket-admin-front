"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import changePurchaseStatus from "@/funcs/changePurchaseStatus";
import Loader from "@/components/modules/Loader";

function ApprovePurchasePanel({
  purchaseInfo,
  approvalMessages = [],
  onClose,
  onSuccess,
}) {
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedMessage = approvalMessages.find(
    (message) => String(message.id) === String(selectedMessageId)
  );

  const handleSubmit = () => {
    if (!selectedMessage) {
      setError("لطفاً یکی از پیام‌های تأیید را انتخاب کنید.");
      return;
    }

    setError("");
    setIsLoading(true);
    changePurchaseStatus({
      orderId: purchaseInfo.id,
      message: selectedMessage.user_message,
      new_order_status: 1,
    }).then(() => {
      setIsLoading(false);
      onSuccess?.();
      onClose?.();
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="mt-3 rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white p-4 md:p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircleOutlineIcon fontSize="small" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-bold text-brand-navy">
                پیام تأیید را انتخاب کنید
              </h3>
              <p className="mt-1 text-xs md:text-sm text-gray-500 leading-6">
                این پیام در پنل سفارشات{" "}
                <span className="font-bold text-gray-700">
                  {purchaseInfo.user.first_name} {purchaseInfo.user.last_name}
                </span>{" "}
                نمایش داده می‌شود.
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
          {approvalMessages.map((message) => {
            const isSelected = String(selectedMessageId) === String(message.id);

            return (
              <button
                key={message.id}
                type="button"
                onClick={() => {
                  setSelectedMessageId(String(message.id));
                  setError("");
                }}
                className={`rounded-xl border px-4 py-3 text-right transition-all ${
                  isSelected
                    ? "border-emerald-300 bg-white shadow-sm ring-2 ring-emerald-200"
                    : "border-gray-200 bg-white/80 hover:border-emerald-200 hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <span className="text-sm font-medium text-gray-700 leading-6">
                    {message.user_message}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedMessage ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-3">
            <InfoOutlinedIcon sx={{ fontSize: 18 }} className="text-brand-blue mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-navy">پیش‌نمایش پیام کاربر</p>
              <p className="mt-1 text-sm text-gray-600 leading-6">
                {selectedMessage.user_message}
              </p>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="admin-btn !bg-[#004B8F] !text-white hover:!bg-[#00386b] !py-2 !px-5 text-sm"
            onClick={handleSubmit}
          >
            تأیید و ارسال پیام
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

export default ApprovePurchasePanel;
