"use client";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Loader from "@/components/modules/Loader";
import deleteShippingRate from "@/funcs/deleteShippingRate";
import RateFormPanel from "./RateFormPanel";

function RateBox(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const combinedTotal = Number(props.tier1_price) + Number(props.tier2_price);

  const deleteHandler = () => {
    setIsLoading(true);
    deleteShippingRate(props.id).then(() => {
      setIsLoading(false);
      props.getRatesHandler();
    });
  };

  if (isEditing) {
    return (
      <RateFormPanel
        key={props.id}
        mode="edit"
        rateId={props.id}
        defaultProvince={props.province_name}
        defaultCity={props.city_name}
        defaultTier1={props.tier1_price}
        defaultTier2={props.tier2_price}
        title="ویرایش نرخ پست"
        submitLabel="ذخیره تغییرات"
        onClose={() => setIsEditing(false)}
        onSuccess={props.getRatesHandler}
      />
    );
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="admin-card overflow-hidden !p-0">
        <div className="flex flex-col gap-4 p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-blue border border-blue-100">
                <LocalShippingOutlinedIcon fontSize="small" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-bold text-brand-navy">
                  {props.city_name}
                </h2>
                <p className="text-xs text-gray-500 mt-1">{props.province_name}</p>
              </div>
            </div>

            <div className="admin-card-actions shrink-0">
              <button
                type="button"
                className="admin-action-edit"
                onClick={() => setIsEditing(true)}
              >
                <BorderColorOutlinedIcon sx={{ fontSize: 16 }} />
                ویرایش
              </button>
              <button
                type="button"
                className="admin-action-delete"
                onClick={deleteHandler}
              >
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                حذف
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <p className="text-xs font-bold text-gray-500 mb-1">پلن ۱ (۱ تا ۳ کیلو)</p>
              <p className="text-sm font-bold text-brand-navy">
                {Number(props.tier1_price).toLocaleString("fa-IR")} تومان
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <p className="text-xs font-bold text-gray-500 mb-1">پلن ۲ (بیشتر از ۳ کیلو)</p>
              <p className="text-sm font-bold text-brand-navy">
                {Number(props.tier2_price).toLocaleString("fa-IR")} تومان
              </p>
              <p className="text-[11px] text-gray-500 mt-1">اضافه بر پلن ۱</p>
            </div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-gray-600 leading-6">
            <span className="font-bold text-brand-navy">بین ۳ تا ۶ کیلو: </span>
            هزینه پلن ۲ (بیشتر از ۳ کیلو) — جمع با پلن ۱ ={" "}
            <span className="font-bold">{combinedTotal.toLocaleString("fa-IR")} تومان</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RateBox;
