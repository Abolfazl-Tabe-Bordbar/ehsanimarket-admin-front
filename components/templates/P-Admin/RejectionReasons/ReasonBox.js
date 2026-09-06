"use client";

import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Loader from "@/components/modules/Loader";
import deleteRejectionReason from "@/funcs/deleteRejectionReason";
import ReasonFormPanel from "./ReasonFormPanel";

function ReasonBox(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteHandler = () => {
    setIsLoading(true);
    deleteRejectionReason(props.id).then(() => {
      setIsLoading(false);
      props.getReasonsHandler();
    });
  };

  if (isEditing) {
    return (
      <ReasonFormPanel
        key={props.id}
        mode="edit"
        reasonId={props.id}
        defaultAdminMessage={props.admin_message}
        defaultUserMessage={props.user_message}
        title="ویرایش دلیل رد"
        submitLabel="ذخیره تغییرات"
        onClose={() => setIsEditing(false)}
        onSuccess={props.getReasonsHandler}
      />
    );
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="admin-card overflow-hidden !p-0">
        <div className="flex flex-col gap-4 p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                <BlockOutlinedIcon fontSize="small" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-bold text-brand-navy">
                  {props.admin_message}
                </h2>
              </div>
            </div>

            <div className="admin-card-actions shrink-0">
              <button
                type="button"
                className="admin-action-edit"
                onClick={() => setIsEditing(true)}
              >
                <BorderColorOutlinedIcon sx={{ fontSize: 16 }} />
                ویرایش
              </button>
              <button
                type="button"
                className="admin-action-delete"
                onClick={deleteHandler}
              >
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                حذف
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-amber-100 bg-gradient-to-b from-amber-50/80 to-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <StorefrontOutlinedIcon
                  sx={{ fontSize: 16 }}
                  className="text-amber-700"
                />
                <p className="text-xs font-bold text-amber-800">
                  پیام مدیریت و بخش فروش
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-7">{props.admin_message}</p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <PersonOutlineOutlinedIcon
                  sx={{ fontSize: 16 }}
                  className="text-brand-blue"
                />
                <p className="text-xs font-bold text-brand-navy">پیام کاربر</p>
              </div>
              <p className="text-sm text-gray-700 leading-7">{props.user_message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReasonBox;
