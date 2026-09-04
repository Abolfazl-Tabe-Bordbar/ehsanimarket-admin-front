"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import editBrand from "@/funcs/editBrand";
import BrandFormFields from "./BrandFormFields";
import BrandLogoField from "./BrandLogoField";

function EditBrandModal({ setIsModalShow, itemData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState(itemData.logo_file || "");
  const [changeLogo, setChangeLogo] = useState(0);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    reset({
      name: itemData.name || "",
    });
    setLogo(itemData.logo_file || "");
    setChangeLogo(0);
  }, [itemData, reset]);

  const onSubmit = (data) => {
    setIsLoading(true);
    editBrand(
      {
        ...data,
        logo: typeof logo === "object" ? logo : "",
        change_image: changeLogo,
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
          <h2 className="text-lg font-bold text-brand-navy mb-2">ویرایش برند</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <BrandLogoField
              logo={logo}
              onChange={(nextLogo, nextChangeLogo) => {
                setLogo(nextLogo);
                setChangeLogo(nextChangeLogo ?? 0);
              }}
            />
            <BrandFormFields register={register} errors={errors} />
            <button type="submit" className="admin-btn-accent w-full mt-8">
              ذخیره تغییرات
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditBrandModal;
