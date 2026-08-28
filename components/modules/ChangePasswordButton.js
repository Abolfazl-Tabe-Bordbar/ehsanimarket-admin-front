"use client";

import React, { useState } from "react";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ChangePasswordModal from "./ChangePasswordModal";

function ChangePasswordButton() {
  const [isChangePasswordModalShow, setIsChangePasswordModalShow] =
    useState(false);

  return (
    <>
      {isChangePasswordModalShow && (
        <ChangePasswordModal
          setIsChangePasswordModalShow={setIsChangePasswordModalShow}
        />
      )}
      <button
        type="button"
        className="admin-btn-ghost !px-2.5 !py-2"
        onClick={() => setIsChangePasswordModalShow(true)}
        title="تغییر رمز عبور"
      >
        <p className="hidden xs:block text-sm">تغییر رمز</p>
        <LockResetOutlinedIcon sx={{ fontSize: 20 }} />
      </button>
    </>
  );
}

export default ChangePasswordButton;
