"use client";

import React, { useState } from "react";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PurchaseDetailsModal from "./PurchaseDetailsModal";
import RejectPurchasePanel from "./RejectPurchasePanel";
import ApprovePurchasePanel from "./ApprovePurchasePanel";
import Swal from "sweetalert2";
import {
  getPurchaseAdminInternalMessage,
  getPurchaseUserMessage,
  purchaseTabStatusConfig,
} from "./purchaseHelpers";
import CopyButton from "./CopyButton";

function MetaItem({ icon: Icon, label, value, highlight = false, copyValue = null }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5 min-w-[140px]">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 mb-1">
        <Icon sx={{ fontSize: 14 }} />
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <p
          className={`text-sm leading-6 break-all ${
            highlight ? "font-bold text-brand-navy" : "font-medium text-gray-700"
          }`}
        >
          {value}
        </p>
        {copyValue ? (
          <CopyButton value={copyValue} label="شناسه پرداخت کپی شد" />
        ) : null}
      </div>
    </div>
  );
}

function PurchaseBox({
  purchaseInfo,
  status,
  getPurchasesHandler = "",
  rejectionReasons = [],
  approvalMessages = [],
}) {
  const [isPurchaseDetailsModalShow, setIsPurchaseDetailsModalShow] =
    useState(false);
  const [activePanel, setActivePanel] = useState(null);

  const openRejectPanel = () => {
    if (!rejectionReasons.length) {
      Swal.fire({
        icon: "warning",
        title: "دلیلی برای رد ثبت نشده",
        text: "ابتدا از بخش «دلایل رد خرید» حداقل یک دلیل تعریف کنید.",
        confirmButtonText: "متوجه شدم",
      });
      return;
    }

    setActivePanel((current) => (current === "reject" ? null : "reject"));
  };

  const openApprovePanel = () => {
    if (!approvalMessages.length) {
      Swal.fire({
        icon: "warning",
        title: "پیامی برای تأیید ثبت نشده",
        text: "ابتدا از بخش «پیام‌های تأیید سفارش» حداقل یک پیام تعریف کنید.",
        confirmButtonText: "متوجه شدم",
      });
      return;
    }

    setActivePanel((current) => (current === "approve" ? null : "approve"));
  };

  const statusMeta = purchaseTabStatusConfig[status] || purchaseTabStatusConfig.pending;
  const adminInternalMessage = getPurchaseAdminInternalMessage(purchaseInfo);
  const userMessage = getPurchaseUserMessage(purchaseInfo, status);
  const fullName = `${purchaseInfo.user.first_name} ${purchaseInfo.user.last_name}`;
  const paymentRef = purchaseInfo?.payment?.ref_id;

  return (
    <div className="space-y-3">
      {isPurchaseDetailsModalShow && (
        <PurchaseDetailsModal
          setIsPurchaseDetailsModalShow={setIsPurchaseDetailsModalShow}
          purchaseInfo={purchaseInfo}
          status={status}
        />
      )}

      <div className="admin-card overflow-hidden !p-0">
        <div className="p-4 md:p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10">
                <PersonOutlineOutlinedIcon fontSize="small" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-bold text-brand-navy line-clamp-1">
                  {fullName}
                </h2>
                {status === "pending" ? (
                  <p className="mt-1 text-xs text-gray-500">
                    این سفارش منتظر تأیید یا رد شماست
                  </p>
                ) : null}
              </div>
            </div>

            <span
              className={`inline-flex items-center self-start rounded-full border px-3 py-1 text-xs font-medium ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <MetaItem
              icon={CalendarTodayOutlinedIcon}
              label="تاریخ خرید"
              value={new Date(purchaseInfo.createdAt).toLocaleDateString("fa")}
            />
            <MetaItem
              icon={PaymentsOutlinedIcon}
              label="مبلغ سفارش"
              value={`${purchaseInfo.total_price.toLocaleString("fa")} تومان`}
              highlight
            />
            {paymentRef ? (
              <MetaItem
                icon={ReceiptLongOutlinedIcon}
                label="شناسه پرداخت"
                value={paymentRef}
                copyValue={paymentRef}
              />
            ) : null}
          </div>

          {status === "not-send" ? (
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-3">
                <p className="text-[11px] font-bold text-amber-800 mb-1">
                  پیام مدیریت و فروش
                </p>
                <p className="text-sm text-gray-700 leading-6">{adminInternalMessage}</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
                <p className="text-[11px] font-bold text-brand-navy mb-1">پیام کاربر</p>
                <p className="text-sm text-gray-700 leading-6">{userMessage}</p>
              </div>
            </div>
          ) : status !== "pending" ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3">
              <p className="text-[11px] font-bold text-emerald-800 mb-1">
                {status === "send" ? "پیام ارسال" : "پیام"}
              </p>
              <p className="text-sm text-gray-700 leading-6">{userMessage}</p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-gray-100">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 text-sm font-medium text-brand-navy hover:text-[#00386b] transition-colors"
              onClick={() => setIsPurchaseDetailsModalShow(true)}
            >
              نمایش جزئیات
              <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 18 }} />
            </button>

            {status === "pending" ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={`admin-btn !py-2 !px-4 text-sm ${
                    activePanel === "reject"
                      ? "!bg-red-700 !text-white"
                      : "!bg-red-600 !text-white hover:!bg-red-700"
                  }`}
                  onClick={openRejectPanel}
                >
                  {activePanel === "reject" ? "بستن رد" : "رد"}
                </button>
                <button
                  type="button"
                  className={`admin-btn !py-2 !px-4 text-sm ${
                    activePanel === "approve"
                      ? "!bg-[#00386b] !text-white"
                      : "!bg-[#004B8F] !text-white hover:!bg-[#00386b]"
                  }`}
                  onClick={openApprovePanel}
                >
                  {activePanel === "approve" ? "بستن تأیید" : "تایید"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {activePanel === "reject" ? (
        <RejectPurchasePanel
          purchaseInfo={purchaseInfo}
          rejectionReasons={rejectionReasons}
          onClose={() => setActivePanel(null)}
          onSuccess={getPurchasesHandler}
        />
      ) : null}

      {activePanel === "approve" ? (
        <ApprovePurchasePanel
          purchaseInfo={purchaseInfo}
          approvalMessages={approvalMessages}
          onClose={() => setActivePanel(null)}
          onSuccess={getPurchasesHandler}
        />
      ) : null}
    </div>
  );
}

export default PurchaseBox;
