"use client";

import React from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function ArticleCoverField({
  cover,
  onCoverChange,
  currentCoverUrl = "",
  currentCoverName = "",
}) {
  const previewSrc = cover
    ? URL.createObjectURL(cover)
    : currentCoverUrl || "";

  return (
    <section className="admin-section">
      <h3 className="admin-section-title">تصویر کاور</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {previewSrc ? (
          <div className="relative shrink-0">
            <img
              src={previewSrc}
              alt=""
              className="w-full sm:w-44 h-32 object-cover rounded-xl border border-gray-200 bg-white"
            />
            {cover && (
              <button
                type="button"
                onClick={() => onCoverChange(null)}
                className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-lg bg-red-500 px-2 py-1 text-[11px] text-white"
              >
                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                حذف
              </button>
            )}
          </div>
        ) : null}

        <label className="flex-1 w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-4 py-8 cursor-pointer hover:border-brand-gold/50 hover:bg-brand-gold/[0.03] transition-colors">
          <AddPhotoAlternateOutlinedIcon className="text-brand-gold" />
          <span className="text-sm font-medium text-brand-navy">
            {cover || currentCoverName ? "تغییر تصویر کاور" : "انتخاب تصویر کاور"}
          </span>
          <span className="text-xs text-gray-500">فرمت‌های تصویری · پیشنهاد ابعاد افقی</span>
          {currentCoverName && !cover && (
            <span className="text-[11px] text-gray-400">فایل فعلی: {currentCoverName}</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onCoverChange(e.target.files?.[0] || null)}
          />
        </label>
      </div>
    </section>
  );
}

export default ArticleCoverField;
