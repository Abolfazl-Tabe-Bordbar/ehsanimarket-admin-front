"use client";

import { uploadUrl } from "@/data/variables";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import CopyButton from "./CopyButton";
import {
  getPurchaseAdminInternalMessage,
  getPurchaseUserMessage,
  purchaseTabStatusConfig,
} from "./purchaseHelpers";

function PurchaseDetails({
  setIsPurchaseDetailsModalShow,
  purchaseInfo,
  status = "pending",
}) {
  const statusMeta = purchaseTabStatusConfig[status] || purchaseTabStatusConfig.pending;
  const adminInternalMessage = getPurchaseAdminInternalMessage(purchaseInfo);
  const userMessage = getPurchaseUserMessage(purchaseInfo, status);
  const paymentRef = purchaseInfo?.payment?.ref_id;
  const productsSubtotal = purchaseInfo.orderItems.reduce(
    (sum, item) => sum + Number(item.total_price || item.product_price * item.count),
    0
  );
  const shippingCost = Number(purchaseInfo.shipping_cost || 0);
  const discountAmount = Number(purchaseInfo.discount_amount || 0);

  return (
    <div className="admin-modal-overlay" onClick={() => setIsPurchaseDetailsModalShow(false)}>
      <div
        className="admin-modal-panel !max-w-[1100px] !py-6 sm:!py-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="admin-modal-close"
          onClick={() => setIsPurchaseDetailsModalShow(false)}
          aria-label="بستن"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 pr-10">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-brand-navy">
                جزئیات سفارش
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {purchaseInfo.user.first_name} {purchaseInfo.user.last_name}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                <span className="text-gray-500">تاریخ خرید:</span>
                <span className="font-bold text-brand-navy">
                  {new Date(purchaseInfo.createdAt).toLocaleDateString("fa")}
                </span>
              </div>

              <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm">
                <ReceiptLongOutlinedIcon sx={{ fontSize: 16 }} className="text-brand-blue" />
                <span className="text-gray-600">شناسه پرداخت:</span>
                <span className="font-bold text-brand-navy break-all">{paymentRef}</span>
                <CopyButton value={paymentRef} label="شناسه پرداخت کپی شد" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 md:p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-gray-700">وضعیت سفارش:</span>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusMeta.className}`}
              >
                {statusMeta.label}
              </span>
            </div>

            {status === "not-send" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-3">
                  <p className="text-xs font-bold text-gray-500 mb-1">
                    پیام مدیریت و بخش فروش
                  </p>
                  <p className="text-sm text-gray-700 leading-7">{adminInternalMessage}</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-3">
                  <p className="text-xs font-bold text-gray-500 mb-1">پیام کاربر</p>
                  <p className="text-sm text-gray-700 leading-7">{userMessage}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-white px-3 py-3">
                <p className="text-xs font-bold text-gray-500 mb-1">
                  {status === "send" ? "پیام ارسال" : "توضیح"}
                </p>
                <p className="text-sm text-gray-700 leading-7">{userMessage}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-[6] space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <LocalMallOutlinedIcon sx={{ fontSize: 18 }} className="text-brand-navy" />
                <h3 className="text-base font-bold text-brand-navy">اقلام سفارش</h3>
              </div>

              {purchaseInfo.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="admin-card !p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={`${uploadUrl}/products/${
                          item.product_images_path ? item.product_images_path[0] : ""
                        }`}
                        className="h-full w-full object-contain p-2"
                        alt={item.product_name}
                      />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <h4 className="font-bold text-sm md:text-base text-brand-navy line-clamp-2">
                        {item.product_name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500">
                        تعداد:{" "}
                        <span className="font-bold text-gray-700">
                          {item.count.toLocaleString("fa")}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-sm whitespace-nowrap sm:text-left">
                    <span className="text-gray-500">مبلغ:</span>{" "}
                    <span className="text-base md:text-lg font-bold text-brand-navy">
                      {item.product_price.toLocaleString("fa")}
                    </span>{" "}
                    <span className="text-xs text-gray-500">تومان</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-[2] space-y-4">
              <div className="admin-card space-y-5">
                <h3 className="text-base font-bold text-brand-navy text-center">
                  فاکتور خرید
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 text-sm">
                    <span className="text-gray-600">
                      جمع کالاها ({purchaseInfo.orderItems.length.toLocaleString("fa")})
                    </span>
                    <span className="font-bold text-brand-navy">
                      {productsSubtotal.toLocaleString("fa")} تومان
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        هزینه پست
                        {purchaseInfo.total_weight_kg > 0 && (
                          <span className="text-xs text-gray-400 mr-1">
                            ({Number(purchaseInfo.total_weight_kg).toLocaleString("fa")} کیلو)
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-brand-navy">
                        {shippingCost.toLocaleString("fa")} تومان
                      </span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-700">
                      <span>تخفیف</span>
                      <span>-{discountAmount.toLocaleString("fa")} تومان</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-brand-navy">جمع کل</span>
                    <span className="text-lg font-bold text-brand-navy">
                      {purchaseInfo.total_price.toLocaleString("fa")}{" "}
                      <span className="text-xs font-medium text-gray-500">تومان</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-card space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} className="text-brand-navy" />
                  <h3 className="text-base font-bold text-brand-navy">اطلاعات گیرنده</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">نام گیرنده</p>
                    <p className="text-gray-700">
                      {purchaseInfo.user.first_name} {purchaseInfo.user.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">شماره تماس</p>
                    <p className="text-gray-700">{purchaseInfo.user.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">آدرس</p>
                    <p className="text-gray-700 leading-7">{purchaseInfo.user.address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">کد پستی</p>
                    <p className="text-gray-700">{purchaseInfo.user.post_code}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;
