"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import login from "@/funcs/login";
import Loader from "@/components/modules/Loader";

function Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    login(data, router).then(() => setIsLoading(false));
  };

  const inputBaseClass =
    "w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-[#CA8549] focus:ring-2 focus:ring-[#CA8549]/20";

  return (
    <>
      {isLoading && <Loader />}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            نام کاربری
          </label>
          <div className="relative">
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
            </span>
            <input
              id="username"
              type="text"
              placeholder="نام کاربری خود را وارد کنید"
              autoComplete="username"
              className={inputBaseClass}
              {...register("username", { required: true, minLength: 6 })}
            />
          </div>
          {errors.username?.type === "required" && (
            <p className="text-red-500 text-xs mr-1">نام کاربری اجباری است</p>
          )}
          {errors.username?.type === "minLength" && (
            <p className="text-red-500 text-xs mr-1">نام کاربری حداقل باید ۶ کاراکتر باشد</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            رمز عبور
          </label>
          <div className="relative">
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <LockOutlinedIcon sx={{ fontSize: 20 }} />
            </span>
            <input
              id="password"
              type={isPasswordShow ? "text" : "password"}
              placeholder="رمز عبور خود را وارد کنید"
              autoComplete="current-password"
              className={`${inputBaseClass} pl-11`}
              {...register("password", { required: true, minLength: 6 })}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setIsPasswordShow((prev) => !prev)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isPasswordShow ? "مخفی کردن رمز" : "نمایش رمز"}
            >
              {isPasswordShow ? (
                <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>
          {errors.password?.type === "required" && (
            <p className="text-red-500 text-xs mr-1">رمز عبور اجباری است</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500 text-xs mr-1">رمز عبور حداقل باید ۶ کاراکتر باشد</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#CA8549] hover:bg-[#b8743f] active:bg-[#a66635] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 mt-2 transition-all duration-200 shadow-lg shadow-[#CA8549]/25 hover:shadow-[#CA8549]/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? "در حال ورود..." : "ورود به پنل"}
        </button>
      </form>
    </>
  );
}

export default Form;
