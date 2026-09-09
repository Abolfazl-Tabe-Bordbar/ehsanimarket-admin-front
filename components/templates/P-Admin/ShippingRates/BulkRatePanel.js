"use client";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import bulkDefineShippingRates from "@/funcs/bulkDefineShippingRates";
import { IRAN_LOCATIONS } from "@/data/iranLocations";

function BulkRatePanel({ onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      tier1_price: 100,
      tier2_price: 300,
      overwrite: false,
    },
  });

  const tier1 = watch("tier1_price");
  const tier2 = watch("tier2_price");

  const cities = useMemo(() => {
    const match = IRAN_LOCATIONS.find((item) => item.province === selectedProvince);
    return match?.cities || [];
  }, [selectedProvince]);

  const onSubmit = (data) => {
    if (!selectedProvince) return;

    const payload = {
      province_name: selectedProvince,
      tier1_price: Number(data.tier1_price),
      tier2_price: Number(data.tier2_price),
      cities,
      overwrite: Boolean(data.overwrite),
    };

    setIsLoading(true);
    bulkDefineShippingRates(payload).then((res) => {
      setIsLoading(false);
      if (res?.status) {
        onSuccess?.();
        onClose?.();
      }
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-card px-4 py-4 mb-4 border-2 border-[#CA8549]/20">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm md:text-base font-bold text-brand-navy">تعریف گروهی هزینه پست</h2>
            <p className="text-xs text-gray-500 mt-1">
              برای تمام شهرهای یک استان، یک‌جا نرخ پست تعریف کنید
            </p>
          </div>
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
          <div className="space-y-2">
            <label className="block text-sm font-bold">استان</label>
            <select
              className="admin-input"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              required
            >
              <option value="">انتخاب استان</option>
              {IRAN_LOCATIONS.map((item) => (
                <option key={item.province} value={item.province}>
                  {item.province}
                </option>
              ))}
            </select>
          </div>

          {selectedProvince && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-gray-600">
              <span className="font-bold text-brand-navy">{cities.length.toLocaleString("fa-IR")} شهر</span>
              {" "}در استان {selectedProvince} با این نرخ‌ها ثبت می‌شوند.
            </div>
          )}

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

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              {...register("overwrite")}
            />
            شهرهایی که قبلاً ثبت شده‌اند هم به‌روزرسانی شوند
          </label>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="admin-btn-primary !py-2 !px-5 text-sm"
              disabled={!selectedProvince || !cities.length}
            >
              اعمال برای کل استان
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

export default BulkRatePanel;
