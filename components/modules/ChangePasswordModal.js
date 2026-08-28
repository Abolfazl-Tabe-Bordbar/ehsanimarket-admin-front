"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Loader from "@/components/modules/Loader";
import updateMyPassword from "@/funcs/updateMyPassword";

function ChangePasswordModal({ setIsChangePasswordModalShow }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    updateMyPassword({ password: data.password }).then((res) => {
      setIsLoading(false);
      if (res?.status) {
        setIsChangePasswordModalShow(false);
      }
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed w-full h-[100vh] flex justify-center top-0 left-0 bg-black bg-opacity-50 z-50">
        <div className="bg-white w-11/12 md:w-[500px] max-h-fit rounded-xl my-4 px-8 pb-12 pt-16 overflow-auto relative">
          <div
            className="absolute top-4 left-4 cursor-pointer"
            onClick={() => setIsChangePasswordModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div>
            <h4 className="text-base md:text-lg font-bold text-center mb-2">
              تغییر رمز عبور
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 space-y-2 relative">
                <label htmlFor="password" className="block text-sm font-bold">
                  رمز عبور جدید
                </label>
                <input
                  type={isPasswordShow ? "text" : "password"}
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="password"
                  {...register("password", { required: true, minLength: 6 })}
                />
                <span className="absolute left-4 top-8 text-gray-900 cursor-pointer">
                  {isPasswordShow ? (
                    <VisibilityOffOutlinedIcon
                      fontSize="small"
                      onClick={() => setIsPasswordShow(false)}
                    />
                  ) : (
                    <VisibilityOutlinedIcon
                      fontSize="small"
                      onClick={() => setIsPasswordShow(true)}
                    />
                  )}
                </span>
                {errors.password?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    رمز عبور اجباری است
                  </p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500 text-xs mr-2">
                    رمز عبور حداقل باید ۶ کاراکتر باشد
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-[#CA8549] text-white rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base"
                >
                  تغییر رمز عبور
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePasswordModal;
