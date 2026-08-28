"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import createTestimonial from "@/funcs/createTestimonial";
import TestimonialFormFields from "./TestimonialFormFields";
import TestimonialImageField from "./TestimonialImageField";

function AddTestimonialModal({ setIsModalShow }) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      type: "person",
      sort_order: 0,
      is_active: true,
    },
  });

  const handleImageChange = (nextImage) => {
    setImage(nextImage);
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    createTestimonial({
      ...data,
      is_active: Boolean(data.is_active),
      image,
    }).finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div className="admin-modal-panel max-h-[90vh] overflow-auto">
          <div className="admin-modal-close" onClick={() => setIsModalShow(false)}>
            <CloseIcon />
          </div>
          <h2 className="text-lg font-bold text-brand-navy mb-2">افزودن نظر جدید</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TestimonialImageField image={image} onChange={handleImageChange} />
            <TestimonialFormFields register={register} errors={errors} />
            <button type="submit" className="admin-btn-accent w-full mt-8">
              ثبت نظر
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddTestimonialModal;
