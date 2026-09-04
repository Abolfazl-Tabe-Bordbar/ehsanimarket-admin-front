import React from "react";

function BrandFormFields({ register, errors }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-2">
        <label htmlFor="brand-name" className="block text-sm font-bold">
          نام برند
        </label>
        <input
          id="brand-name"
          type="text"
          className="w-full rounded-full border px-3 py-2 text-sm text-gray-700 outline-gray-300"
          {...register("name", { required: true, minLength: 2 })}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mr-2">نام برند اجباری است</p>
        )}
      </div>
    </div>
  );
}

export default BrandFormFields;
