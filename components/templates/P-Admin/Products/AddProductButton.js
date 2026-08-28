"use client";
import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import ExelOutputModal from "./ExelOutputModal";

function AddProductButton() {
  const [isAddProductModalShow, setIsAddProductModalShow] = useState(false);
  const [isExelOutputModalShow, setIsExelOutputModalShow] = useState(false);

  return (
    <>
      {isAddProductModalShow && (
        <AddProductModal setIsAddProductModalShow={setIsAddProductModalShow} />
      )}
      {isExelOutputModalShow && (
        <ExelOutputModal setIsExelOutputModalShow={setIsExelOutputModalShow} />
      )}
      <div className="flex flex-wrap gap-2">
        <button
          className="admin-btn-primary"
          onClick={() => setIsAddProductModalShow(true)}
        >
          ایجاد محصول جدید
        </button>
        <button
          className="admin-btn-success"
          onClick={() => setIsExelOutputModalShow(true)}
        >
          دریافت خروجی اکسل
        </button>
      </div>
    </>
  );
}

export default AddProductButton;
