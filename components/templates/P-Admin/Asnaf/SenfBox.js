"use client";
import { uploadUrl } from "@/data/variables";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
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

  const createdAtLabel = props.createdAt
    ? new Date(props.createdAt).toLocaleDateString("fa-IR")
    : "—";

  return (
    <div>
      {isLoading && <Loader />}
      {isEditSenfModalShow && (
        <EditSenfModal
          setIsEditSenfModalShow={setIsEditSenfModalShow}
          senfData={props}
        />
      )}

      <article className="admin-card overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1.5">
              {props.image_path ? (
                <img
                  src={`${uploadUrl}/senf/${props.image_path}`}
                  alt={props.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <CategoryOutlinedIcon sx={{ fontSize: 28, color: "#94a3b8" }} />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-gray-900">
                {props.name}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                شناسه:{" "}
                <span className="font-semibold text-gray-700">{props.id}</span>
              </p>
            </div>
          </div>

          <div className="admin-card-actions shrink-0">
            <button
              type="button"
              className="admin-action admin-action-edit"
              onClick={() => setIsEditSenfModalShow(true)}
            >
              <BorderColorOutlinedIcon sx={{ fontSize: 18 }} />
              ویرایش
            </button>
            <button
              type="button"
              className="admin-action admin-action-delete"
              onClick={deleteSenfHandler}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              حذف
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">تاریخ ثبت</p>
            <p className="mt-1 text-sm font-bold text-[#141c32]">
              {createdAtLabel}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500">نوع</p>
            <p className="mt-1 text-sm font-bold text-[#CA8549]">
              دسته‌بندی اصلی
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default SenfBox;
