"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import createAdmin from "@/funcs/createAdmin";

function AddAdminModal({ setIsAddAdminModalShow }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    createAdmin(data).then(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="addAdminModal"
          className="admin-modal-panel max-h-[90vh] overflow-auto"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsAddAdminModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 space-y-2">
                <label htmlFor="first_name" className="block text-sm font-bold">
                  نام
                </label>
                <input
                  type="text"
                  className="border rounded-full px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="first_name"
                  {...register("first_name", { required: true })}
                />
                {errors.first_name?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">نام اجباری است</p>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <label htmlFor="last_name" className="block text-sm font-bold">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  className="border rounded-full px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="last_name"
                  {...register("last_name", { required: true })}
                />
                {errors.last_name?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    نام خانوادگی اجباری است
                  </p>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <label htmlFor="username" className="block text-sm font-bold">
                  نام کاربری (شماره موبایل)
                </label>
                <input
                  type="text"
                  className="border rounded-full px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="username"
                  {...register("username", { required: true })}
                />
                {errors.username?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    نام کاربری اجباری است
                  </p>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <label htmlFor="password" className="block text-sm font-bold">
                  رمز عبور
                </label>
                <input
                  type="password"
                  className="border rounded-full px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="password"
                  {...register("password", { required: true })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    رمز عبور اجباری است
                  </p>
                )}
              </div>
              <div>
                <button className="bg-[#CA8549] text-white rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base">
                  ثبت ادمین
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAdminModal;
