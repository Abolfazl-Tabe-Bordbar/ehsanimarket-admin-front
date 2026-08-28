"use client";
import { uploadUrl, siteUrl } from "@/data/variables";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Loader from "@/components/modules/Loader";
import deleteBanner from "@/funcs/deleteBanner";
import EditBannerModal from "./EditBannerModal";
import Link from "next/link";

import {
  getBannerDeviceLabel,
  getBannerPageLabel,
  getBannerSectionLabel,
} from "@/components/admin/bannerConfig";

function BannerBox(props) {
  const [isEditBannerModalShow, setIsEditBannerModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteBannerHandler = () => {
    setIsLoading(true);
    deleteBanner(props.id).then(() => {
      setIsLoading(false);
      props.getBannersHandler();
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isEditBannerModalShow && (
        <EditBannerModal
          setIsEditBannerModalShow={setIsEditBannerModalShow}
          bannerData={props}
        />
      )}
      <div className="admin-card py-2 pr-2 lg:px-4 flex justify-between items-center relative">
        <div className="flex items-end lg:items-center gap-2 lg:gap-4">
          <img
            src={`${uploadUrl}/baners/${props.image_file}`}
            className="w-[60px] h-[55px] object-contain"
            alt=""
          />
          <div className="flex flex-col lg:flex-row mt-6 lg:mt-0">
            <div className="flex items-center gap-4 lg:gap-4">
              <h2 className="text-sm lg:text-base font-bold line-clamp-1">
                {getBannerPageLabel(props.page)}
              </h2>
              <div className="whitespace-nowrap text-xs lg:text-base">
                <span>مکان : </span>{" "}
                <span className="font-bold">
                  {getBannerSectionLabel(props.section)}
                </span>
              </div>
            </div>
            <div className="flex items-center mt-2 lg:mt-0">
              <div className="whitespace-nowrap lg:mr-4 ml-4 text-xs lg:text-base">
                <span>دستگاه : </span>{" "}
                <span className="font-bold">
                  {getBannerDeviceLabel(props.device)}
                </span>
              </div>
              <div className="line-clamp-1 text-xs lg:text-base">
                <span>لینک :</span>{" "}
                <Link
                  href={`${siteUrl}${props.link}`}
                  dir="ltr"
                  target="_blank"
                  className="font-bold underline"
                >
                  {props.link}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 left-4 lg:static flex items-center gap-5 text-xs lg:text-base">
          <div
            className="flex items-center gap-1 text-[#004B8F] cursor-pointer"
            onClick={() => setIsEditBannerModalShow(true)}
          >
            ویرایش
            <span className="text-sm lg:text-2xl">
              <BorderColorOutlinedIcon fontSize="" />
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-[#F51313] cursor-pointer"
            onClick={deleteBannerHandler}
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

export default BannerBox;
