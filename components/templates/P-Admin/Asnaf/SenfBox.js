"use client";
import { uploadUrl } from "@/data/variables";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import EditSenfModal from "./EditSenfModal";
import deleteSenf from "@/funcs/deleteSenf";
import Loader from "@/components/modules/Loader";

function SenfBox(props) {
  const [isEditSenfModalShow, setIsEditSenfModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteSenfHandler = () => {
    setIsLoading(true);
    deleteSenf(props.id).then(() => {
      setIsLoading(false);
      props.getAsnafHandler();
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isEditSenfModalShow && (
        <EditSenfModal
          setIsEditSenfModalShow={setIsEditSenfModalShow}
          senfData={props}
        />
      )}
      <div className="admin-card py-4 px-4 flex justify-between items-center relative">
        <div className="flex items-end lg:items-center lg:gap-8">
          <img
            src={`${uploadUrl}/senf/${props.image_path}`}
            alt=""
            className="w-[60px] h-[55px] object-contain"
          />
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8 mt-6 lg:mt-0">
            <h2 className="text-sm lg:text-base font-bold line-clamp-1">
              {props.name}
            </h2>
            <div className="whitespace-nowrap text-xs lg:text-base">
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
            onClick={() => setIsEditSenfModalShow(true)}
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

export default SenfBox;
