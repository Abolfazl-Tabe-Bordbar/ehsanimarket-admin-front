"use client";
import React, { useState } from "react";
import AddBannerModal from "@/components/templates/P-Admin/Banners/AddBannerModal";

function AddBannerButton() {
  const [isAddBannerModalShow, setIsAddBannerModalShow] = useState(false);

  return (
    <>
      {isAddBannerModalShow && (
        <AddBannerModal setIsAddBannerModalShow={setIsAddBannerModalShow} />
      )}
      <button
        className="admin-btn-primary"
        onClick={() => setIsAddBannerModalShow(true)}
      >
        ایجاد بنر جدید
      </button>
    </>
  );
}

export default AddBannerButton;
