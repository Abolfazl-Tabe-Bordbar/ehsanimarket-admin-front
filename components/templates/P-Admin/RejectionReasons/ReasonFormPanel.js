"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import createRejectionReason from "@/funcs/createRejectionReason";
import editRejectionReason from "@/funcs/editRejectionReason";

function ReasonFormPanel({
  mode = "add",
  reasonId,
  defaultAdminMessage = "",
  defaultUserMessage = "",
  title,
  submitLabel,
  onClose,
  onSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      admin_message: defaultAdminMessage,
      user_message: defaultUserMessage,
    },
  });

  const onSubmit = (data) => {
    const payload = {
      admin_message: data.admin_message?.trim(),
      user_message: data.user_message?.trim(),
    };

    setIsLoading(true);
    const request =
      mode === "edit"
        ? editRejectionReason(payload, reasonId)
        : createRejectionReason(payload);

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
          <div className="space-y-2">
            <label
              htmlFor={`reason-admin-${mode}-${reasonId || "new"}`}
              className="block text-sm font-bold"
            >
              پیام برای مدیریت و بخش فروش
            </label>
            <textarea
              id={`reason-admin-${mode}-${reasonId || "new"}`}
              rows={3}
              className="admin-input !rounded-2xl"
              placeholder="این پیام فقط در پنل مدیریت نمایش داده می‌شود"
              {...register("admin_message", { required: true, minLength: 2 })}
            />
            {errors.admin_message?.type === "minLength" && (
              <p className="text-red-500 text-xs mr-2">
                پیام مدیریت باید حداقل ۲ کاراکتر باشد
              </p>
            )}
            {errors.admin_message?.type === "required" && (
              <p className="text-red-500 text-xs mr-2">پیام مدیریت اجباری است</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`reason-user-${mode}-${reasonId || "new"}`}
              className="block text-sm font-bold"
            >
              پیام برای کاربر
            </label>
            <textarea
              id={`reason-user-${mode}-${reasonId || "new"}`}
              rows={3}
              className="admin-input !rounded-2xl"
              placeholder="این پیام در پنل سفارشات کاربر نمایش داده می‌شود"
              {...register("user_message", { required: true, minLength: 2 })}
            />
            {errors.user_message?.type === "minLength" && (
              <p className="text-red-500 text-xs mr-2">
                پیام کاربر باید حداقل ۲ کاراکتر باشد
              </p>
            )}
            {errors.user_message?.type === "required" && (
              <p className="text-red-500 text-xs mr-2">پیام کاربر اجباری است</p>
            )}
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

export default ReasonFormPanel;
