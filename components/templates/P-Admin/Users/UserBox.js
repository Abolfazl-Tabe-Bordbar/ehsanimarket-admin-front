"use client";
import React, { useState } from "react";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

function formatAddress(props) {
  if (props.province && props.city) {
    return `${props.province}، ${props.city}، ${props.address || ""}`.replace(/،\s*$/, "");
  }
  return props.address || "—";
}

function UserBox(props) {
  const [isShowDetails, setIsShowDetails] = useState(false);

  return (
    <div className="admin-card py-4 px-4 flex flex-col gap-4 relative pb-12 lg:pb-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        <div className="flex flex-col gap-4 xs:flex-row md:flex-wrap justify-between w-full lg:gap-8 lg:w-auto">
          <h2 className="line-clamp-1 text-sm lg:text-base font-bold">
            {props.first_name} {props.last_name}
          </h2>
          <div className="whitespace-nowrap text-xs lg:text-base">
            <span>تاریخ ثبت نام :</span>{" "}
            <span className="font-bold">
              {new Date(props.createdAt).toLocaleDateString("fa-IR")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 xs:flex-row justify-between w-full lg:gap-8 lg:w-auto">
          {/* <div className="whitespace-nowrap text-xs lg:text-base">
            <span>نقش :</span>
            {" "}
            <span className="font-bold text-[#119E30]">مدیر</span>
          </div> */}
          <div className="whitespace-nowrap text-xs lg:text-base">
            <span>کد پستی :</span>{" "}
            <span className="font-bold">{props.post_code}</span>
          </div>
          <div className="whitespace-nowrap text-xs lg:text-base">
            <span>شماره تماس :</span>{" "}
            <span className="font-bold">{props.phone_number}</span>
          </div>
        </div>
        {/* <div className="whitespace-nowrap text-xs lg:text-base">
          <span>ایمیل : </span>{" "}
          <span className="font-bold">Alimoradi@gmail.com</span>
        </div> */}
      </div>
      <div
        className={`flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 ${
          !isShowDetails && "hidden"
        }`}
      >
        <div className="flex flex-col gap-4 xs:flex-row justify-between w-full lg:gap-8 lg:w-auto">
          <div className="whitespace-nowrap text-xs lg:text-base">
            <span>آدرس :</span>{" "}
            <span className="font-bold">{formatAddress(props)}</span>
          </div>
          <div className="whitespace-nowrap text-xs lg:text-base">
            <span>نام کاربری :</span>{" "}
            <span className="font-bold">{props.username}</span>
          </div>
        </div>
      </div>
      <div
        className="flex items-center gap-1 text-[#004B8F] cursor-pointer text-xs lg:text-base absolute lg:static left-4 bottom-4"
        onClick={() => setIsShowDetails(!isShowDetails)}
      >
        نمایش جزئیات
        <span className="text-sm lg:text-2xl">
          <KeyboardArrowDownOutlinedIcon fontSize="" className={isShowDetails ? "rotate-180" : ""} />
        </span>
      </div>
    </div>
  );
}

export default UserBox;
