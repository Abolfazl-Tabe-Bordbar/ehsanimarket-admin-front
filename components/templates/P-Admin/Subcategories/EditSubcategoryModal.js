"use client";
import { uploadUrl } from "@/data/variables";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Loader from "@/components/modules/Loader";
import getAsnaf from "@/funcs/getAsnaf";
import getCookie from "@/funcs/cookies/getCookie";
import editSubcategory from "@/funcs/editSubcategory";

function EditSubcategoryModal({
  setIsEditSubcategoryModalShow,
  subcategoryData,
}) {
  const [subcategoryImage, setSubcategoryImage] = useState("");
  const [isSubcategoryImageChange, setIsSubcategoryImageChange] =
    useState(false);
  const [isSubcategoryImageErrorShow, setIsSubcategoryImageErrorShow] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [asnaf, setAsnaf] = useState([]);
  const [isGetAsnafPending, setIsGetAsnafPending] = useState(true);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    if (subcategoryImage) {
      setIsLoading(true);
      editSubcategory(
        {
          ...data,
          image: subcategoryImage,
          change_image: isSubcategoryImageChange ? "1" : "0",
        },
        subcategoryData.id
      ).then(() => {
        setIsLoading(false);
        subcategoryData.getSubcategoriesHandler();
        setIsEditSubcategoryModalShow(false);
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

    setValue("name", subcategoryData.name);
    setSubcategoryImage(subcategoryData.image_path);
  }, []);

  useEffect(() => {
    if (asnaf?.length) {
      setValue("parent_id", subcategoryData.parent_id);
    }
  }, [asnaf]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="addSubcategoryModal"
          className="admin-modal-panel max-h-[90vh] overflow-auto !max-w-[500px]"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsEditSubcategoryModalShow(false)}
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
                    setIsSubcategoryImageChange(true);
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
                      src={
                        typeof subcategoryImage === "object"
                          ? URL.createObjectURL(subcategoryImage)
                          : `${uploadUrl}/senf/${subcategoryImage}`
                      }
                      className="rounded w-[110px] h-[100px] object-contain"
                      alt=""
                    />
                    <div
                      className="text-white bg-[#C92222] bg-opacity-90 absolute bottom-3 right-1/2 translate-x-1/2 rounded-sm flex px-0.5 cursor-pointer"
                      onClick={() => {
                        setSubcategoryImage("");
                        setIsSubcategoryImageChange(true);
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
                  className="admin-input !rounded-xl"
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
                  {asnaf?.length || isGetAsnafPending
                    ? asnaf?.map((senf) => (
                        <option
                          key={senf.id}
                          value={senf.id}
                          className="text-black"
                        >
                          {senf.name}
                        </option>
                      ))
                    : (
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
                  className="admin-input !rounded-xl"
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
                  type="submit"
                  className="admin-btn-accent rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base"
                  onClick={() => {
                    subcategoryImage
                      ? setIsSubcategoryImageErrorShow(false)
                      : setIsSubcategoryImageErrorShow(true);
                  }}
                >
                  ویرایش زیردسته
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditSubcategoryModal;
