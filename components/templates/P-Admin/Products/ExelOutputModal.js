"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import exportExelOutput from "@/funcs/exportExelOutput";
import { apiBaseUrl } from "@/data/variables";

function ExelOutputModal({ setIsExelOutputModalShow }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    exportExelOutput({
      start_time: data.start,
      end_time: data.end,
    })
      .then((res) => {
        if (res?.file) {
          const linkElem = document.createElement("a");
          linkElem.href = `${apiBaseUrl}${res?.file}`;
          linkElem.download = "";
          linkElem.click();
          setIsExelOutputModalShow(false);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="addSenfModal"
          className="bg-white w-11/12 md:w-[500px] max-h-fit rounded-xl my-4 px-8 pb-14 pt-20 overflow-auto relative"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsExelOutputModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 space-y-2">
                <label htmlFor="start" className="block text-sm font-bold">
                  تاریخ شروع
                </label>

                <Controller
                  control={control}
                  name="start"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={field.value}
                      onChange={(date) => field.onChange(date?.toDate())}
                      inputClass="w-full border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                      containerStyle={{
                        width: "100%",
                      }}
                      calendarPosition="bottom-center"
                    />
                  )}
                />

                {errors.start && (
                  <p className="text-red-500 text-xs mr-2">
                    تاریخ شروع اجباری است
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <label htmlFor="end" className="block text-sm font-bold">
                  تاریخ پایان
                </label>

                <Controller
                  control={control}
                  name="end"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={field.value}
                      onChange={(date) => field.onChange(date?.toDate())}
                      inputClass="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                      containerStyle={{
                        width: "100%",
                      }}
                      calendarPosition="bottom-center"
                    />
                  )}
                />

                {errors.end && (
                  <p className="text-red-500 text-xs mr-2">
                    تاریخ پایان اجباری است
                  </p>
                )}
              </div>
              <div>
                <button className="bg-[#CA8549] text-white rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base">
                  دانلود خروجی
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExelOutputModal;
