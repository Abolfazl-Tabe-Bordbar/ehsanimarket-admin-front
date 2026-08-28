"use client";

import React from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { uploadUrl } from "@/data/variables";

function TestimonialImageField({ image, onChange }) {
  const previewSrc =
    !image
      ? ""
      : typeof image === "object"
        ? URL.createObjectURL(image)
        : `${uploadUrl}/testimonials/${image}`;

  return (
    <div className="mt-6 space-y-2">
      <label htmlFor="testimonial-image" className="block text-sm font-bold">
        تصویر (اختیاری)
      </label>
      <label
        htmlFor="testimonial-image"
        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-black px-3 py-2.5 text-xs text-white md:text-sm"
      >
        <AddPhotoAlternateOutlinedIcon className="text-xl" />
        انتخاب تصویر
      </label>
      <input
        id="testimonial-image"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file, 1);
        }}
      />
      <p className="text-xs text-gray-500">لوگو، عکس پروفایل یا تصویر کسب‌وکار</p>

      {previewSrc && (
        <div className="relative mt-3 inline-block rounded-md border p-1 pb-9">
          <img
            src={previewSrc}
            alt=""
            className="h-24 w-24 rounded-2xl object-cover"
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

export default TestimonialImageField;
