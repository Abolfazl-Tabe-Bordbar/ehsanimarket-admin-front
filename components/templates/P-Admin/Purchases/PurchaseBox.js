"use client";
import React, { useState } from "react";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import PurchaseDetailsModal from "./PurchaseDetailsModal";
import Swal from "sweetalert2";
import changePurchaseStatus from "@/funcs/changePurchaseStatus";
import Loader from "@/components/modules/Loader";
import {
  getPurchaseAdminMessage,
  purchaseTabStatusConfig,
} from "./purchaseHelpers";

function PurchaseBox({ purchaseInfo, status, getPurchasesHandler = "" }) {
  const [isPurchaseDetailsModalShow, setIsPurchaseDetailsModalShow] =
    useState(false);
  const [isLoaderShow, setIsLoaderShow] = useState(false);

  const confirmPurchase = () => {
    Swal.fire({
      title: "یک پیام برای خرید کاربر بگذارید",
      text: "این پیام در پنل سفارشات کاربر نمایش داده می شود",
      input: "text",
      showCancelButton: true,
      cancelButtonText: "لغو",
      confirmButtonText: "تایید",
      confirmButtonColor: "#004B8F",
      inputAutoFocus: false,
      inputValidator: (value) => {
        if (!value) {
          return "مسیج اجباری است";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoaderShow(true);
        changePurchaseStatus({
          orderId: purchaseInfo.id,
          message: result.value,
          new_order_status: 1,
        }).then(() => {
          setIsLoaderShow(false);
          getPurchasesHandler();
        });
      }
    });
  };

  const cancelPurchase = () => {
    Swal.fire({
      title: "دلیل رد خرید کاربر را بنویسید",
      text: "این پیام در پنل سفارشات کاربر نمایش داده می شود",
      input: "text",
      showCancelButton: true,
      cancelButtonText: "لغو",
      confirmButtonText: "رد",
      confirmButtonColor: "#C92222",
      inputAutoFocus: false,
      inputValidator: (value) => {
        if (!value) {
          return "مسیج اجباری است";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoaderShow(true);
        changePurchaseStatus({
          orderId: purchaseInfo.id,
          message: result.value,
          new_order_status: 2,
        }).then(() => {
          setIsLoaderShow(false);
          getPurchasesHandler();
        });
      }
    });
  };

  const statusMeta = purchaseTabStatusConfig[status] || purchaseTabStatusConfig.pending;
  const adminMessage = getPurchaseAdminMessage(purchaseInfo, status);

  return (
    <div>
      {isLoaderShow && <Loader />}
      {isPurchaseDetailsModalShow && (
        <PurchaseDetailsModal
          setIsPurchaseDetailsModalShow={setIsPurchaseDetailsModalShow}
          purchaseInfo={purchaseInfo}
          status={status}
        />
      )}
      <div className="admin-card py-4 px-4 flex flex-col gap-2 lg:flex-row justify-between relative">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8 w-full lg:w-auto">
          <div className="flex justify-between w-full lg:gap-8 lg:w-auto">
            <h2 className="line-clamp-1 text-sm lg:text-base font-bold">
              {purchaseInfo.user.first_name} {purchaseInfo.user.last_name}
            </h2>
            <div className="whitespace-nowrap text-xs lg:text-base">
              <span>تاریخ خرید :</span>{" "}
              <span className="font-bold">
                {new Date(purchaseInfo.createdAt).toLocaleDateString("fa")}
              </span>
            </div>
          </div>

          {/* <div className="whitespace-nowrap text-xs lg:text-base">
          <span>وضعیت :</span>{" "}
          <span className="font-bold text-[#C92222]">لغو شده</span>
        </div> */}
          <div className="whitespace-nowrap text-xs lg:text-base">
            <span>مبلغ سفارش : </span>{" "}
            <span className="text-sm lg:text-lg font-bold">
              {purchaseInfo.total_price.toLocaleString("fa")}{" "}
              <span className="text-xs font-medium">تومان</span>
            </span>
          </div>

          <div className="w-full lg:w-auto space-y-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
            <p className="text-xs lg:text-sm text-gray-600 leading-6 max-w-xl">
              <span className="font-medium text-gray-500">
                {status === "send"
                  ? "پیام ارسال: "
                  : status === "not-send"
                    ? "دلیل ارسال نشدن: "
                    : "وضعیت: "}
              </span>
              {adminMessage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "pending" ? (
            <>
              <button
                className="px-2 py-1 bg-[#C92222] text-white text-xs lg:text-base rounded-md"
                onClick={cancelPurchase}
              >
                رد
              </button>
              <button
                className="px-2 py-1 bg-[#004B8F] text-white text-xs lg:text-base rounded-md"
                onClick={confirmPurchase}
              >
                تایید
              </button>
            </>
          ) : (
            ""
          )}
          <div
            className={`whitespace-nowrap flex items-center gap-1 text-[#004B8F] cursor-pointer text-xs lg:text-base absolute lg:static left-4 ${
              status == "pending" ? "bottom-4.5" : "bottom-6"
            }`}
            onClick={() => setIsPurchaseDetailsModalShow(true)}
          >
            نمایش جزئیات
            <span className="text-sm lg:text-2xl">
              <KeyboardArrowDownOutlinedIcon fontSize="" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseBox;
