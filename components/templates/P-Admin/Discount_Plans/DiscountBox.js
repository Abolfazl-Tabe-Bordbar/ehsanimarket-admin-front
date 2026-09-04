"use client";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Loader from "@/components/modules/Loader";
import deleteDiscountPlan from "@/funcs/deleteDiscountPlan";
import changeDiscountPlanStatus from "@/funcs/changeDiscountPlanStatus";
import EditDiscountModal from "./EditDiscountModal";

const translateColors = {
  bronze: "برنزی",
  silver: "نقره‌ای",
  golden: "طلایی",
};

const colorStyles = {
  bronze: "bg-amber-50 text-amber-800 border-amber-200",
  silver: "bg-slate-100 text-slate-700 border-slate-200",
  golden: "bg-yellow-50 text-yellow-800 border-yellow-200",
};

function DiscountBox(props) {
  const [isEditDiscountModalShow, setIsEditDiscountModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteDiscountHandler = () => {
    setIsLoading(true);
    deleteDiscountPlan(props.id).then(() => {
      setIsLoading(false);
      props.getDiscountPlansHandler();
    });
  };

  const changeStatusHandler = () => {
    setIsLoading(true);
    changeDiscountPlanStatus(props.id).then(() => {
      setIsLoading(false);
      props.getDiscountPlansHandler();
    });
  };

  const tierClass = colorStyles[props?.color] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div>
      {isLoading && <Loader />}
      {isEditDiscountModalShow && (
        <EditDiscountModal
          setIsEditDiscountModalShow={setIsEditDiscountModalShow}
          discountData={props}
        />
      )}

      <article className="admin-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${tierClass}`}
              aria-hidden="true"
            >
              <LocalOfferOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-bold text-gray-900">
                  {props?.name}
                </h2>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tierClass}`}
                >
                  {translateColors[props?.color] || props?.color}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                کد:{" "}
                <span className="dir-ltr inline-block rounded-md bg-gray-100 px-2 py-0.5 font-bold tracking-wide text-gray-800">
                  {props?.code}
                </span>
              </p>
            </div>
          </div>

          <div className="admin-card-actions shrink-0">
            <button
              type="button"
              className={`admin-action ${
                props?.is_active
                  ? "text-emerald-700 hover:bg-emerald-50"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={changeStatusHandler}
            >
              {props?.is_active ? (
                <>
                  <ToggleOffOutlinedIcon sx={{ fontSize: 18 }} />
                  فعال
                </>
              ) : (
                <>
                  <ToggleOnOutlinedIcon sx={{ fontSize: 18 }} />
                  غیرفعال
                </>
              )}
            </button>
            <button
              type="button"
              className="admin-action admin-action-edit"
              onClick={() => setIsEditDiscountModalShow(true)}
            >
              <BorderColorOutlinedIcon sx={{ fontSize: 18 }} />
              ویرایش
            </button>
            <button
              type="button"
              className="admin-action admin-action-delete"
              onClick={deleteDiscountHandler}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              حذف
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">درصد تخفیف</p>
            <p className="mt-1 text-lg font-bold text-[#141c32]">
              {props?.percentage}%
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">حداقل مبلغ سبد</p>
            <p className="mt-1 text-lg font-bold text-[#CA8549]">
              {Number(props?.minimum_price || 0).toLocaleString("fa-IR")}
              <span className="mr-1 text-xs font-medium text-gray-500">تومان</span>
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">وضعیت</p>
            <p
              className={`mt-1 text-sm font-bold ${
                props?.is_active ? "text-emerald-700" : "text-gray-400"
              }`}
            >
              {props?.is_active ? "در حال استفاده" : "غیرفعال"}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default DiscountBox;
