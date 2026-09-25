"use client";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import Loader from "@/components/modules/Loader";
import deleteFestival from "@/funcs/deleteFestival";
import changeFestivalStatus from "@/funcs/changeFestivalStatus";
function getStatus(festival) {
  const now = Date.now();
  const start = new Date(festival.starts_at).getTime();
  const end = new Date(festival.ends_at).getTime();
  if (!festival.is_active) return { label: "غیرفعال", className: "text-gray-400" };
  if (now < start) return { label: "شروع‌نشده", className: "text-amber-600" };
  if (now > end) return { label: "منقضی", className: "text-red-500" };
  return { label: "در حال اجرا", className: "text-emerald-700" };
}

function FestivalBox({ festival, onChanged, onEdit, isEditing = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const status = getStatus(festival);

  const deleteHandler = async () => {
    setIsLoading(true);
    await deleteFestival(festival.id);
    setIsLoading(false);
    onChanged?.();
  };

  const changeStatusHandler = async () => {
    setIsLoading(true);
    await changeFestivalStatus(festival.id);
    setIsLoading(false);
    onChanged?.();
  };

  return (
    <div>
      {isLoading && <Loader />}
      <article
        className={`admin-card overflow-hidden transition-shadow ${
          isEditing ? "ring-2 ring-[#CA8549]/40 shadow-md shadow-[#CA8549]/10" : ""
        }`}
      >
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#CA8549]/30 bg-[#CA8549]/10 text-[#CA8549]">
              <CelebrationOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-gray-900">{festival.name}</h2>
              {festival.description ? (
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{festival.description}</p>
              ) : null}
            </div>
          </div>

          <div className="admin-card-actions shrink-0">
            <button
              type="button"
              className={`admin-action ${
                festival.is_active
                  ? "text-emerald-700 hover:bg-emerald-50"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={changeStatusHandler}
            >
              {festival.is_active ? (
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
              onClick={() => onEdit?.()}
            >
              <BorderColorOutlinedIcon sx={{ fontSize: 18 }} />
              ویرایش
            </button>
            <button
              type="button"
              className="admin-action admin-action-delete"
              onClick={deleteHandler}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              حذف
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">حداقل سبد</p>
            <p className="mt-1 text-lg font-bold text-[#CA8549]">
              {Number(festival.min_cart_amount || 0).toLocaleString("fa-IR")}
              <span className="mr-1 text-xs font-medium text-gray-500">تومان</span>
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">بازه زمانی</p>
            <p className="mt-1 text-sm font-bold text-[#141c32]">
              {new Date(festival.starts_at).toLocaleDateString("fa-IR")} تا{" "}
              {new Date(festival.ends_at).toLocaleDateString("fa-IR")}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">وضعیت</p>
            <p className={`mt-1 text-sm font-bold ${status.className}`}>{status.label}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">محصولات</p>
            <p className="mt-1 text-lg font-bold text-[#141c32]">
              {(festival.products || []).length.toLocaleString("fa-IR")}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(festival.city_names || []).map((city) => (
            <span
              key={city}
              className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
            >
              {city}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

export default FestivalBox;
