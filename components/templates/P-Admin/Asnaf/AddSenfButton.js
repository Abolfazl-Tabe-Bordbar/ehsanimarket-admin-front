"use client";
import React, { useState } from "react";
import AddSenfModal from "@/components/templates/P-Admin/Asnaf/AddSenfModal";

function AddSenfButton() {
  const [isAddSenfModalShow, setIsAddSenfModalShow] = useState(false);

  return (
    <>
      {isAddSenfModalShow && (
        <AddSenfModal setIsAddSenfModalShow={setIsAddSenfModalShow} />
      )}
      <button
        className="admin-btn-primary"
        onClick={() => setIsAddSenfModalShow(true)}
      >
        ایجاد دسته بندی جدید
      </button>
    </>
  );
}

export default AddSenfButton;
