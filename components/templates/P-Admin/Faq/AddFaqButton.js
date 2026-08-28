"use client"
import React, { useState } from "react";
import AddFaqModal from "./AddFaqModal";

function AddFaqButton() {
  const [isAddFaqModalShow, setIsAddFaqModalShow] = useState(false);

  return (
    <>
    {isAddFaqModalShow && (
      <AddFaqModal setIsAddFaqModalShow={setIsAddFaqModalShow} />
    )}
    <button
      className="admin-btn-primary"
      onClick={() => setIsAddFaqModalShow(true)}
    >
      ایجاد سوال جدید
    </button>
  </>
  )
}

export default AddFaqButton