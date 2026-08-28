"use client";
import React, { useState } from "react";
import AddDiscountModal from "./AddDiscountModal";

function AddDiscountButton() {
  const [isAddDiscountModalShow, setIsAddDiscountModalShow] = useState(false);

  return (
    <>
      {isAddDiscountModalShow && (
        <AddDiscountModal setIsAddDiscountModalShow={setIsAddDiscountModalShow} />
      )}
      <div className="flex justify-between">
        <button
          className="admin-btn-primary"
          onClick={() => setIsAddDiscountModalShow(true)}
        >
          ایجاد پلن تخفیف جدید
        </button>
      </div>
    </>
  );
}

export default AddDiscountButton;
