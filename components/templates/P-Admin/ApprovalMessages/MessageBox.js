"use client";

import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Loader from "@/components/modules/Loader";
import deleteApprovalMessage from "@/funcs/deleteApprovalMessage";
import MessageFormPanel from "./MessageFormPanel";

function MessageBox(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteHandler = () => {
    setIsLoading(true);
    deleteApprovalMessage(props.id).then(() => {
      setIsLoading(false);
      props.getMessagesHandler();
    });
  };

  if (isEditing) {
    return (
      <MessageFormPanel
        key={props.id}
        mode="edit"
        stage={props.stage || "approve"}
        messageId={props.id}
        defaultUserMessage={props.user_message}
        title="ویرایش پیام"
        submitLabel="ذخیره تغییرات"
        onClose={() => setIsEditing(false)}
        onSuccess={props.getMessagesHandler}
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircleOutlineIcon fontSize="small" />
              </div>
              <h2 className="text-sm md:text-base font-bold text-brand-navy leading-7">
                {props.user_message}
              </h2>
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

          <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} className="text-brand-blue" />
              <p className="text-xs font-bold text-brand-navy">پیام کاربر</p>
            </div>
            <p className="text-sm text-gray-700 leading-7">{props.user_message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
