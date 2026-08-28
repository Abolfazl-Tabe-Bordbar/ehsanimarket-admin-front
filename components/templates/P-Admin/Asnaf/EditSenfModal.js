"use client";
import { uploadUrl } from "@/data/variables";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import editSenf from "@/funcs/editSenf";
import Loader from "@/components/modules/Loader";

function EditSenfModal({ setIsEditSenfModalShow, senfData }) {
  const [senfImage, setSenfImage] = useState("");
  const [isSenfImageChange, setIsSenfImageChange] = useState(false);
  const [isSenfImageErrorShow, setIsSenfImageErrorShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    if (senfImage) {
      setIsLoading(true);
      editSenf(
        {
          name: data.name,
          image: senfImage,
          change_image: isSenfImageChange ? "1" : "0",
        },
        senfData.id
      ).then(() => {
        setIsLoading(false);
        senfData.getAsnafHandler();
        setIsEditSenfModalShow(false);
      });
    } else {
      document.getElementById("editSenfModal").scrollTo(0, 0);
    }
  };

  useEffect(() => {
    setValue("name", senfData.name);
    setSenfImage(senfData.image_path);
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="editSenfModal"
          className="admin-modal-panel max-h-[90vh] overflow-auto !max-w-[500px]"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsEditSenfModalShow(false)}
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
                  افزودن عکس دسته بندی
                </label>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    setSenfImage(e.target.files[0]);
                    setIsSenfImageChange(true);
                    e.target.files[0]
                      ? setIsSenfImageErrorShow(false)
                      : setIsSenfImageErrorShow(true);
                  }}
                />
              </div>
              {isSenfImageErrorShow && (
                <p className="text-red-500 text-xs md:mr-4 mt-2">
                  تصویر دسته بندی اجباری است
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-6 text-xs md:text-base">
                {senfImage && (
                  <div className="relative pb-9 pt-1 border rounded-md">
                    <img
                      src={
                        typeof senfImage === "object"
                          ? URL.createObjectURL(senfImage)
                          : `${uploadUrl}/senf/${senfImage}`
                      }
                      className="rounded w-[110px] h-[100px] object-contain"
                      alt=""
                    />
                    <div
                      className="text-white bg-[#C92222] bg-opacity-90 absolute bottom-3 right-1/2 translate-x-1/2 rounded-sm flex px-0.5 cursor-pointer"
                      onClick={() => {
                        setSenfImage("");
                        setIsSenfImageChange(true);
                        setIsSenfImageErrorShow(true);
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
                <label htmlFor="name" className="block text-sm font-bold">
                  نام دسته بندی
                </label>
                <input
                  type="text"
                  className="admin-input !rounded-xl"
                  id="name"
                  {...register("name", { required: true })}
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    نام دسته بندی اجباری است
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="admin-btn-accent rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base"
                  onClick={() => {
                    senfImage
                      ? setIsSenfImageErrorShow(false)
                      : setIsSenfImageErrorShow(true);
                  }}
                >
                  ویرایش دسته
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditSenfModal;
