"use client";
import React, { useState } from "react";
import AddSubcategoryModal from "./AddSubcategoryModal";

function AddSubcategoryButton() {
  const [isAddSubcategoryModalShow, setIsAddSubcategoryModalShow] =
    useState(false);

  return (
    <>
      {isAddSubcategoryModalShow && (
        <AddSubcategoryModal
          setIsAddSubcategoryModalShow={setIsAddSubcategoryModalShow}
        />
      )}
      <button
        className="admin-btn-primary"
        onClick={() => setIsAddSubcategoryModalShow(true)}
      >
        ایجاد زیردسته جدید
      </button>
    </>
  );
}

export default AddSubcategoryButton;
