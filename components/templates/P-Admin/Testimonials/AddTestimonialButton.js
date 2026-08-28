"use client";

import React, { useState } from "react";
import AddTestimonialModal from "./AddTestimonialModal";

function AddTestimonialButton() {
  const [isModalShow, setIsModalShow] = useState(false);

  return (
    <>
      {isModalShow && <AddTestimonialModal setIsModalShow={setIsModalShow} />}
      <button type="button" className="admin-btn-primary" onClick={() => setIsModalShow(true)}>
        افزودن نظر جدید
      </button>
    </>
  );
}

export default AddTestimonialButton;
