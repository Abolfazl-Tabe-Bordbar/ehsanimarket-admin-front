"use client";

import React from "react";

function TestimonialFormFields({ register, errors }) {
  return (
    <>
      <div className="mt-6 space-y-2">
        <label htmlFor="name" className="block text-sm font-bold">
          نام
        </label>
        <input
          id="name"
          type="text"
          className="admin-input"
          placeholder="نام شخص یا کسب‌وکار"
          {...register("name", { required: true, minLength: 2 })}
        />
        {errors.name && <p className="text-red-500 text-xs mr-2">نام اجباری است</p>}
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="type" className="block text-sm font-bold">
          نوع
        </label>
        <select id="type" className="admin-input" {...register("type", { required: true })}>
          <option value="person">شخص</option>
          <option value="business">کسب‌وکار</option>
        </select>
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="subtitle" className="block text-sm font-bold">
          عنوان / حوزه فعالیت
        </label>
        <input
          id="subtitle"
          type="text"
          className="admin-input"
          placeholder="مثلاً قناد، رستوران، مشتری وفادار"
          {...register("subtitle")}
        />
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="text" className="block text-sm font-bold">
          متن نظر
        </label>
        <textarea
          id="text"
          rows={4}
          className="admin-input min-h-[120px] resize-y"
          placeholder="متن نظر را بنویسید..."
          {...register("text", { required: true, minLength: 5 })}
        />
        {errors.text && <p className="text-red-500 text-xs mr-2">متن نظر اجباری است</p>}
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="sort_order" className="block text-sm font-bold">
          ترتیب نمایش
        </label>
        <input
          id="sort_order"
          type="number"
          className="admin-input"
          defaultValue={0}
          {...register("sort_order")}
        />
        <p className="text-xs text-gray-500">عدد کمتر = نمایش زودتر</p>
      </div>

      <div className="mt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked {...register("is_active")} />
          <span className="text-sm font-medium">نمایش در صفحه اصلی</span>
        </label>
      </div>
    </>
  );
}

export default TestimonialFormFields;
