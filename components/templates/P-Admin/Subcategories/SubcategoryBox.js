"use client";
import { uploadUrl } from "@/data/variables";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Loader from "@/components/modules/Loader";
import deleteSubcategory from "@/funcs/deleteSubcategory";
import EditSubcategoryModal from "./EditSubcategoryModal";

function SubcategoryBox(props) {
  const [isEditSubcategoryModalShow, setIsEditSubcategoryModalShow] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteSenfHandler = () => {
    setIsLoading(true);
    deleteSubcategory(props.id).then(() => {
      setIsLoading(false);
      props.getSubcategoriesHandler();
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isEditSubcategoryModalShow && (
        <EditSubcategoryModal
          setIsEditSubcategoryModalShow={setIsEditSubcategoryModalShow}
          subcategoryData={props}
        />
      )}
      <div className="admin-card py-4 px-4 flex justify-between items-center relative">
        <div className="flex items-end lg:items-center gap-2 lg:gap-8">
          <img
            src={`${uploadUrl}/senf/${props.image_path}`}
            alt=""
            className="w-[60px] h-[55px] object-contain"
          />
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8 mt-6 lg:mt-0">
            <div className="flex items-center flex-wrap lg:flex-nowrap gap-2 lg:gap-x-8 gap-y-0">
              <h2 className="text-sm lg:text-base font-bold line-clamp-1">
                {props.name}
              </h2>
              <div className="text-xs lg:text-base">
                <span>دسته والد :</span>{" "}
                <span className="font-bold">{props.parent}</span>
              </div>
            </div>
            <div className="text-xs lg:text-base">
              <span>تاریخ ثبت :</span>{" "}
              <span className="font-bold">
                {new Date(props.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-2 left-4 lg:static flex items-center gap-5 text-xs lg:text-base">
          <div
            className="flex items-center gap-1 text-[#004B8F] cursor-pointer"
            onClick={() => setIsEditSubcategoryModalShow(true)}
          >
            ویرایش
            <span className="text-sm lg:text-2xl">
              <BorderColorOutlinedIcon fontSize="" />
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-[#F51313] cursor-pointer"
            onClick={deleteSenfHandler}
          >
            حذف
            <span className="text-sm lg:text-2xl">
              <DeleteOutlineIcon fontSize="" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubcategoryBox;
