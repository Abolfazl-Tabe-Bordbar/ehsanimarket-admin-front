"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Loader from "@/components/modules/Loader";
import getAsnaf from "@/funcs/getAsnaf";
import getCookie from "@/funcs/cookies/getCookie";
import createSubcategory from "@/funcs/createSubcategory";

function AddSubcategoryModal({ setIsAddSubcategoryModalShow }) {
  const [subcategoryImage, setSubcategoryImage] = useState("");
  const [isSubcategoryImageErrorShow, setIsSubcategoryImageErrorShow] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [asnaf, setAsnaf] = useState([]);
  const [isGetAsnafPending, setIsGetAsnafPending] = useState(true);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    if (subcategoryImage) {
      setIsLoading(true);
      createSubcategory({
        ...data,
        image: subcategoryImage,
      }).then((res) => {
        setIsLoading(false);
      });
    } else {
      document.getElementById("addSubcategoryModal").scrollTo(0, 0);
    }
  };

  useEffect(() => {
    getAsnaf(getCookie("ramian-pakhsh-admin")).then((res) => {
      setAsnaf(res.body);
      setIsGetAsnafPending(false);
    });
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="addSubcategoryModal"
          className="bg-white w-11/12 md:w-[500px] max-h-fit rounded-xl my-4 px-8 pb-14 pt-20 overflow-auto relative"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsAddSubcategoryModalShow(false)}
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
                  افزودن عکس زیردسته
                </label>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    setSubcategoryImage(e.target.files[0]);
                    e.target.files[0]
                      ? setIsSubcategoryImageErrorShow(false)
                      : setIsSubcategoryImageErrorShow(true);
                  }}
                />
              </div>
              {isSubcategoryImageErrorShow && (
                <p className="text-red-500 text-xs md:mr-4 mt-2">
                  تصویر زیردسته اجباری است
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-6 text-xs md:text-base">
                {subcategoryImage && (
                  <div className="relative pb-9 pt-1 border rounded-md">
                    <img
                      src={URL.createObjectURL(subcategoryImage)}
                      className="rounded w-[110px] h-[100px] object-contain"
                    />
                    <div
                      className="text-white bg-[#C92222] bg-opacity-90 absolute bottom-3 right-1/2 translate-x-1/2 rounded-sm flex px-0.5 cursor-pointer"
                      onClick={() => {
                        setSubcategoryImage("");
                        setIsSubcategoryImageErrorShow(true);
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 space-y-2">
                <label htmlFor="parent_id" className="block text-sm font-bold">
                  دسته بندی
                </label>
                <select
                  id="parent_id"
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  {...register("parent_id", { required: true })}
                >
                  <option value="" className="text-black">
                    دسته بندی را انتخاب کنید
                  </option>
                  {isGetAsnafPending && (
                    <option value="" className="text-black">
                      در حال دریافت دسته بندی ها ...
                    </option>
                  )}
                  {asnaf?.length || isGetAsnafPending ? (
                    asnaf?.map((senf) => (
                      <option
                        key={senf.id}
                        value={senf.id}
                        className="text-black"
                      >
                        {senf.name}
                      </option>
                    ))
                  ) : (
                    <option value="" className="text-black">
                      دسته بندی وجود ندارد.
                    </option>
                  )}
                </select>
                {errors.parent_id?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    دسته بندی اجباری است
                  </p>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <label htmlFor="name" className="block text-sm font-bold">
                  نام زیردسته
                </label>
                <input
                  type="text"
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="name"
                  {...register("name", { required: true })}
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    نام زیردسته اجباری است
                  </p>
                )}
              </div>
              <div>
                <button
                  className="bg-[#CA8549] text-white rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base"
                  onClick={() => {
                    subcategoryImage
                      ? setIsSubcategoryImageErrorShow(false)
                      : setIsSubcategoryImageErrorShow(true);
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

export default AddSubcategoryModal;
