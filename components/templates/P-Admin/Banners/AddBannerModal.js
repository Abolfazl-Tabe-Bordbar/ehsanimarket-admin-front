"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Loader from "@/components/modules/Loader";
import createBanner from "@/funcs/createBanner";

function AddBannerModal({ setIsAddBannerModalShow }) {
  const [bannerImage, setBannerImage] = useState("");
  const [isBannerImageErrorShow, setIsBannerImageErrorShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSelectBoxValue, setPageSelectBoxValue] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    if (bannerImage) {
      setIsLoading(true);
      createBanner({
        image: bannerImage,
        section: data.section,
        link: data.link,
        page: data.page,
        device: data.device,
      }).then((res) => setIsLoading(false));
    } else {
      document.getElementById("addBannerModal").scrollTo(0, 0);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="addBannerModal"
          className="bg-white w-[900px] rounded-xl my-4 mx-2 p-5 pb-14 max-h-fit overflow-auto relative"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsAddBannerModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div>
            <div>
              <div>
                <label
                  htmlFor="image"
                  className="w-fit text-white bg-black text-xs md:text-sm rounded-full px-3 py-3 md:mr-4 flex items-center gap-2 cursor-pointer"
                >
                  <AddPhotoAlternateOutlinedIcon
                    fontSize=""
                    className="text-xl md:text-2xl"
                  />
                  افزودن عکس بنر
                </label>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    setBannerImage(e.target.files[0]);
                    e.target.files[0]
                      ? setIsBannerImageErrorShow(false)
                      : setIsBannerImageErrorShow(true);
                  }}
                />
              </div>
              {isBannerImageErrorShow && (
                <p className="text-red-500 text-xs md:mr-4 mt-2">
                  تصویر بنر اجباری است
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-6 text-xs md:text-base">
                {bannerImage && (
                  <div className="relative pb-9 pt-1 border rounded-md">
                    <img
                      src={URL.createObjectURL(bannerImage)}
                      className="rounded w-[200px] h-[100px] object-contain"
                    />
                    <div
                      className="text-white bg-[#C92222] bg-opacity-90 absolute bottom-3 right-1/2 translate-x-1/2 rounded-sm flex px-0.5 cursor-pointer"
                      onClick={() => {
                        setBannerImage("");
                        setIsBannerImageErrorShow(true);
                      }}
                    >
                      حذف{" "}
                      <DeleteOutlinedIcon
                        fontSize=""
                        className="text-sm md:text-2xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-y-4 md:gap-x-10 mt-2"
            >
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="page" className="block text-sm font-bold">
                  صفحه
                </label>
                <select
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="page"
                  {...register("page", { required: true })}
                  onChange={(e) => setPageSelectBoxValue(e.target.value)}
                >
                  <option value="">صفحه را انتخاب کنید</option>
                  <option value="home">خانه</option>
                  <option value="shop">محصولات</option>
                </select>
                {errors.page?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">صفحه اجباری است</p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="section" className="block text-sm font-bold">
                  مکان بنر
                </label>
                <select
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="section"
                  {...register("section", { required: true })}
                >
                  <option value="">مکان بنر را انتخاب کنید</option>
                  {pageSelectBoxValue === "shop" ? (
                    <>
                      <option value="header">هدر</option>
                      <option value="footer">فوتر</option>
                    </>
                  ) : (
                    <>
                      <option value="header">هدر</option>
                      <option value="hero">میانه</option>
                      <option value="footer">فوتر</option>
                    </>
                  )}
                </select>
                {errors.section?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    مکان بنر اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="link" className="block text-sm font-bold">
                  لینک مقصد
                </label>
                <input
                  dir="ltr"
                  type="text"
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="link"
                  {...register("link", { required: true })}
                />
                {errors.link?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    لینک مقصد اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="device" className="block text-sm font-bold">
                  دستگاه
                </label>
                <select
                  type="text"
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="device"
                  {...register("device", { required: true })}
                >
                  <option value="">دستگاه را انتخاب کنید</option>
                  <option value="mobile">موبایل</option>
                  <option value="tablet">تبلت</option>
                  <option value="laptop">تبلت به بالا</option>
                </select>
                {errors.device?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">دستگاه اجباری است</p>
                )}
              </div>
              <div className="col-span-2">
                <button
                  className="bg-[#CA8549] text-white rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base"
                  onClick={() => {
                    bannerImage
                      ? setIsBannerImageErrorShow(false)
                      : setIsBannerImageErrorShow(true);
                  }}
                >
                  ثبت اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddBannerModal;
