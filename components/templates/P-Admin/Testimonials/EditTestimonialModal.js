"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import editTestimonial from "@/funcs/editTestimonial";
import TestimonialFormFields from "./TestimonialFormFields";
import TestimonialImageField from "./TestimonialImageField";

function EditTestimonialModal({ setIsModalShow, itemData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(itemData.image_file || "");
  const [changeImage, setChangeImage] = useState(0);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    reset({
      name: itemData.name || "",
      type: itemData.type || "person",
      subtitle: itemData.subtitle || "",
      text: itemData.text || "",
      sort_order: itemData.sort_order ?? 0,
      is_active: itemData.is_active !== false,
    });
    setImage(itemData.image_file || "");
    setChangeImage(0);
  }, [itemData, reset]);

  const handleImageChange = (nextImage, nextChangeImage) => {
    setImage(nextImage);
    setChangeImage(nextChangeImage);
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    editTestimonial(
      {
        ...data,
        is_active: Boolean(data.is_active),
        image: typeof image === "object" ? image : "",
        change_image: changeImage,
      },
      itemData.id
    ).finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div className="admin-modal-panel max-h-[90vh] overflow-auto">
          <div className="admin-modal-close" onClick={() => setIsModalShow(false)}>
            <CloseIcon />
          </div>
          <h2 className="text-lg font-bold text-brand-navy mb-2">ویرایش نظر</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TestimonialImageField image={image} onChange={handleImageChange} />
            <TestimonialFormFields register={register} errors={errors} />
            <button type="submit" className="admin-btn-accent w-full mt-8">
              ذخیره تغییرات
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditTestimonialModal;
