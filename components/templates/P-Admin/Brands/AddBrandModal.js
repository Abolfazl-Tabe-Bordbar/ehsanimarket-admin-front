"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import createBrand from "@/funcs/createBrand";
import BrandFormFields from "./BrandFormFields";
import BrandLogoField from "./BrandLogoField";

function AddBrandModal({ setIsModalShow }) {
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    createBrand({
      ...data,
      logo,
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
          <h2 className="text-lg font-bold text-brand-navy mb-2">افزودن برند جدید</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <BrandLogoField logo={logo} onChange={(nextLogo) => setLogo(nextLogo)} />
            <BrandFormFields register={register} errors={errors} />
            <button type="submit" className="admin-btn-accent w-full mt-8">
              ثبت برند
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddBrandModal;
