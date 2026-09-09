"use client";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import createShippingRate from "@/funcs/createShippingRate";
import editShippingRate from "@/funcs/editShippingRate";
import { IRAN_LOCATIONS } from "@/data/iranLocations";

function RateFormPanel({
  mode = "add",
  rateId,
  defaultProvince = "",
  defaultCity = "",
  defaultTier1 = 100,
  defaultTier2 = 300,
  title,
  submitLabel,
  onClose,
  onSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(defaultProvince);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      province_name: defaultProvince,
      city_name: defaultCity,
      tier1_price: defaultTier1,
      tier2_price: defaultTier2,
    },
  });

  const tier1 = watch("tier1_price");
  const tier2 = watch("tier2_price");

  const cities = useMemo(() => {
    const match = IRAN_LOCATIONS.find((item) => item.province === selectedProvince);
    return match?.cities || [];
  }, [selectedProvince]);

  const onSubmit = (data) => {
    const payload = {
      province_name: data.province_name?.trim(),
      city_name: data.city_name?.trim(),
      tier1_price: Number(data.tier1_price),
      tier2_price: Number(data.tier2_price),
      tier3_price: 0,
    };

    setIsLoading(true);
    const request =
      mode === "edit"
        ? editShippingRate(payload, rateId)
        : createShippingRate(payload);

    request.then((res) => {
      setIsLoading(false);
      if (res?.status) {
        if (mode === "add") reset();
        onSuccess?.();
        onClose?.();
      }
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-card px-4 py-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-sm md:text-base font-bold text-brand-navy">{title}</h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
            aria-label="بستن"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold">استان</label>
              <select
                className="admin-input"
                {...register("province_name", { required: true })}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setValue("city_name", "");
                }}
              >
                <option value="">انتخاب استان</option>
                {IRAN_LOCATIONS.map((item) => (
                  <option key={item.province} value={item.province}>
                    {item.province}
                  </option>
                ))}
              </select>
              {errors.province_name?.type === "required" && (
                <p className="text-red-500 text-xs mr-2">استان اجباری است</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold">شهر</label>
              <select
                className="admin-input"
                {...register("city_name", { required: true })}
                disabled={!selectedProvince}
              >
                <option value="">انتخاب شهر</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city_name?.type === "required" && (
                <p className="text-red-500 text-xs mr-2">شهر اجباری است</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold">پلن ۱ (۱ تا ۳ کیلو)</label>
              <input
                type="number"
                min="0"
                className="admin-input"
                {...register("tier1_price", { required: true, min: 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold">پلن ۲ (بیشتر از ۳ کیلو)</label>
              <input
                type="number"
                min="0"
                className="admin-input"
                {...register("tier2_price", { required: true, min: 0 })}
              />
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-gray-600 leading-7">
            <span className="font-bold text-brand-navy">۶ کیلو به بالا: </span>
            همان «پلن ۱ + پلن ۲» ={" "}
            <span className="font-bold text-brand-navy">
              {(Number(tier1 || 0) + Number(tier2 || 0)).toLocaleString("fa-IR")} تومان
            </span>
            <span className="block text-xs text-gray-500 mt-1">هزینهٔ جداگانه‌ای برای پلن ۳ تعریف نمی‌شود</span>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" className="admin-btn-primary !py-2 !px-5 text-sm">
              {submitLabel}
            </button>
            <button
              type="button"
              className="admin-btn-secondary !py-2 !px-5 text-sm"
              onClick={onClose}
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RateFormPanel;
