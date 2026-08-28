"use client";
import React, { useState } from "react";
import AddAdminModal from "./AddAdminModal";

function AddAdminButton() {
  const [isAddAdminModalShow, setIsAddAdminModalShow] = useState(false);

  return (
    <>
      {isAddAdminModalShow && (
        <AddAdminModal setIsAddAdminModalShow={setIsAddAdminModalShow} />
      )}
      <button
        className="admin-btn-primary"
        onClick={() => setIsAddAdminModalShow(true)}
      >
        ایجاد ادمین جدید
      </button>
    </>
  );
}

export default AddAdminButton;
