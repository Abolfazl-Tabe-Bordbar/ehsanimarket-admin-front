"use client";
import { uploadUrl } from "@/data/variables";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Loader from "@/components/modules/Loader";
import editBanner from "@/funcs/editBanner";

function EditBannerModal({ setIsEditBannerModalShow, bannerData }) {
  const [bannerImage, setBannerImage] = useState("");
  const [isBannerImageChange, setIsBannerImageChange] = useState(false);
  const [isBannerImageErrorShow, setIsBannerImageErrorShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSelectBoxValue, setPageSelectBoxValue] = useState(bannerData.page);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    if (bannerImage) {
      setIsLoading(true);
      editBanner(
        {
          image: bannerImage,
          section: data.section,
          link: data.link,
          page: data.page,
          device: data.device,
          change_image: isBannerImageChange ? "1" : "0",
        },
        bannerData.id
      ).then(() => {
        setIsLoading(false);
        bannerData.getBannersHandler();
        setIsEditBannerModalShow(false);
      });
    } else {
      document.getElementById("editBannerModal").scrollTo(0, 0);
    }
  };

  useEffect(() => {
    setValue("page", bannerData.page);
    setValue("link", bannerData.link);
    setValue("section", bannerData.section);
    setValue("device", bannerData.device);
    setBannerImage(bannerData.image_file);
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="editBannerModal"
          className="admin-modal-panel max-h-[90vh] overflow-auto !max-w-[900px]"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsEditBannerModalShow(false)}
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
                    setIsBannerImageChange(true);
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
                      src={
                        typeof bannerImage === "object"
                          ? URL.createObjectURL(bannerImage)
                          : `${uploadUrl}/baners/${bannerImage}`
                      }
                      className="rounded w-[200px] h-[100px] object-contain"
                      alt=""
                    />
                    <div
                      className="text-white bg-[#C92222] bg-opacity-90 absolute bottom-3 right-1/2 translate-x-1/2 rounded-sm flex px-0.5 cursor-pointer"
                      onClick={() => {
                        setBannerImage("");
                        setIsBannerImageChange(true);
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
                  type="submit"
                  className="admin-btn-accent rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base"
                  onClick={() => {
                    bannerImage
                      ? setIsBannerImageErrorShow(false)
                      : setIsBannerImageErrorShow(true);
                  }}
                >
                  ویرایش بنر
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditBannerModal;
