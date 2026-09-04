"use client";

import React, { useState } from "react";
import AddBrandModal from "./AddBrandModal";

function AddBrandButton() {
  const [isModalShow, setIsModalShow] = useState(false);

  return (
    <>
      {isModalShow && <AddBrandModal setIsModalShow={setIsModalShow} />}
      <button type="button" className="admin-btn-primary" onClick={() => setIsModalShow(true)}>
        افزودن برند جدید
      </button>
    </>
  );
}

export default AddBrandButton;
