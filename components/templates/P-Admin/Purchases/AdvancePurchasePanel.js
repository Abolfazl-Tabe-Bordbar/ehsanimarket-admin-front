"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import changePurchaseStatus from "@/funcs/changePurchaseStatus";
import Loader from "@/components/modules/Loader";
import { purchaseNextStepConfig } from "./purchaseHelpers";

function AdvancePurchasePanel({
  purchaseInfo,
  tabStatus,
  stageMessages = [],
  onClose,
  onSuccess,
}) {
  const stepConfig = purchaseNextStepConfig[tabStatus];
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!stepConfig) return null;

  const selectedMessage = stageMessages.find(
    (message) => String(message.id) === String(selectedMessageId)
  );

  const handleSubmit = () => {
    if (!selectedMessage) {
      setError("لطفاً یکی از پیام‌ها را انتخاب کنید.");
      return;
    }

    setError("");
    setIsLoading(true);
    changePurchaseStatus({
      orderId: purchaseInfo.id,
      message: selectedMessage.user_message,
      new_order_status: stepConfig.nextStatus,
    }).then(() => {
      setIsLoading(false);
      onSuccess?.();
      onClose?.();
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="mt-3 rounded-2xl border border-brand-navy/10 bg-gradient-to-b from-brand-navy/[0.04] to-white p-4 md:p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
              <ArrowBackOutlinedIcon fontSize="small" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-bold text-brand-navy">
                {stepConfig.title}
              </h3>
              <p className="mt-1 text-xs md:text-sm text-gray-500 leading-6">
                {stepConfig.description}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-sky-100 bg-sky-50/80 px-2.5 py-1.5 text-[11px] md:text-xs text-sky-800 leading-5">
                <SmsOutlinedIcon sx={{ fontSize: 15 }} />
                پس از تأیید این مرحله، پیام به‌صورت خودکار برای کاربر ارسال می‌شود.
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
          {stageMessages.map((message) => {
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
                    ? "border-brand-navy/30 bg-white shadow-sm ring-2 ring-brand-navy/10"
                    : "border-gray-200 bg-white/80 hover:border-brand-navy/20 hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-brand-navy bg-brand-navy"
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
            className="admin-btn-primary !py-2 !px-5 text-sm"
            onClick={handleSubmit}
          >
            {stepConfig.buttonLabel}
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

export default AdvancePurchasePanel;
