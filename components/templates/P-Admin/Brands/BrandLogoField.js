"use client";

import React from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { getBrandLogoUrl } from "./brandHelpers";

function BrandLogoField({ logo, onChange }) {
  const previewSrc =
    !logo
      ? ""
      : typeof logo === "object"
        ? URL.createObjectURL(logo)
        : getBrandLogoUrl({ logo_file: logo });

  return (
    <div className="mt-2 space-y-2">
      <label htmlFor="brand-logo" className="block text-sm font-bold">
        لوگوی برند
      </label>
      <label
        htmlFor="brand-logo"
        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-black px-3 py-2.5 text-xs text-white md:text-sm"
      >
        <AddPhotoAlternateOutlinedIcon className="text-xl" />
        انتخاب لوگو
      </label>
      <input
        id="brand-logo"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file, 1);
        }}
      />
      <p className="text-xs text-gray-500">فرمت PNG یا JPG با پس‌زمینه شفاف پیشنهاد می‌شود</p>

      {previewSrc && (
        <div className="relative mt-3 inline-block rounded-md border p-2 pb-9">
          <img
            src={previewSrc}
            alt=""
            className="h-20 w-20 rounded-xl object-contain bg-gray-50"
          />
          <button
            type="button"
            className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-sm bg-[#C92222] bg-opacity-90 px-1 text-xs text-white"
            onClick={() => onChange("", 2)}
          >
            حذف
            <DeleteOutlinedIcon className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}

export default BrandLogoField;
