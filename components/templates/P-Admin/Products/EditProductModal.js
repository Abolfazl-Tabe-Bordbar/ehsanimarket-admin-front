"use client";
import { uploadUrl } from "@/data/variables";

import React, { useEffect, useState } from "react";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import Loader from "@/components/modules/Loader";
import TiptapEditor from "@/components/modules/TiptapEditor";
import editProduct from "@/funcs/editProduct";
import getAsnaf from "@/funcs/getAsnaf";
import getCookie from "@/funcs/cookies/getCookie";
import getSenfSubcategories from "@/funcs/getSenfSubcategories";
import getBrands from "@/funcs/getBrands";
import { useForm } from "react-hook-form";

function EditProductModal({ setIsEditProductModalShow, productData }) {
  console.log(productData);
  const [productImages, setProductImages] = useState([]);
  const [isProductImagesErrorShow, setIsProductImagesErrorShow] =
    useState(false);
  const [asnaf, setAsnaf] = useState([]);
  const [isGetAsnafPending, setIsGetAsnafPending] = useState(false);
  const [deleteImages, setDeleteImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [senfSubcategories, setSenfSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isGetSenfSubcategoriesPending, setisGetSenfSubcategoriesPending] =
    useState(false);
  const [senfSelectBoxValue, setSenfSelectBoxValue] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isProductDescriptionErrorShow, setIsProductDescriptionErrorShow] =
    useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    setError,
  } = useForm();

  const onSubmit = (data) => {
    console.log({
      name: data.name,
      senf_id: String(data.subcategory) || String(data.senf),
      price: data.price,
      totalPrice: data.totalPrice,
      description: productDescription,
      features: data.features || [],
      images: productImages,
      delete_images: deleteImages,
      count: data.count,
      brand_id: data.brand_id || "",
    });
    if (productImages.length && productDescription?.length >= 8) {
      setIsLoading(true);
      editProduct(
        {
          name: data.name,
          product_code: data.product_code,
          senf_id: String(data.subcategory) || String(data.senf),
          price: data.price,
          totalPrice: data.totalPrice,
          description: productDescription,
          features: data.features || [],
          images: productImages,
          delete_images: deleteImages,
          count: data.count,
          brand_id: data.brand_id || "",
        },
        productData.id,
      ).then((res) => {
        setIsLoading(false);
        productData.getProductsHandler();
        setIsEditProductModalShow(false);
      });
    } else {
      document.getElementById("editProductModal").scrollTo(0, 0);
    }
  };

  const senfChangeHandler = (value) => {
    if (value) {
      setError("senf", { message: "" });
    }
    setSenfSelectBoxValue(value);
    setValue("subcategory", "");
    setSenfSubcategories([]);
    setisGetSenfSubcategoriesPending(true);
    getSenfSubcategories(
      getCookie("ramian-pakhsh-admin"),
      value || undefined,
    ).then((res) => {
      setSenfSubcategories(res);
      setisGetSenfSubcategoriesPending(false);
    });
  };

  useEffect(() => {
    setValue("name", productData.name);
    setValue("product_code", productData.product_code || "");
    setValue("price", productData.price);
    setValue("totalPrice", productData.totalPrice);
    setValue("description", productData.description);
    setValue("features", productData.features);
    setValue("count", productData.count);
    setValue("brand_id", productData.brand_id || productData.brand?.id || "");
    setProductImages(productData.images_path);
    setProductDescription(productData.description);

    setIsGetAsnafPending(true);
    getAsnaf(getCookie("ramian-pakhsh-admin")).then((res) => {
      setAsnaf(res.body);
      setIsGetAsnafPending(false);
    });
    getBrands(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res?.status) setBrands(res.body || []);
    });
  }, []);

  useEffect(() => {
    if (asnaf?.length) {
      setSenfSelectBoxValue(productData.senf?.parent?.id);
      setValue("senf", productData.senf?.parent?.id);
      setisGetSenfSubcategoriesPending(true);
      getSenfSubcategories(
        getCookie("ramian-pakhsh-admin"),
        getValues("senf") || undefined,
      ).then((res) => {
        setSenfSubcategories(res);
        setisGetSenfSubcategoriesPending(false);
      });
    }
  }, [asnaf]);

  useEffect(() => {
    setValue("subcategory", productData.senf?.id);
  }, [senfSubcategories]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed w-full h-[100vh] flex justify-center top-0 left-0 bg-black bg-opacity-30 z-50">
        <div
          id="editProductModal"
          className="bg-white w-[900px] max-h-fit rounded-xl my-4 mx-2 p-5 pb-14 overflow-auto relative"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsEditProductModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div>
            <div>
              <label
                htmlFor="image"
                className="w-fit text-white bg-black text-xs md:text-sm rounded-full px-3 py-3 md:mr-4 flex items-center gap-2 cursor-pointer"
              >
                <AddPhotoAlternateOutlinedIcon
                  fontSize=""
                  className="text-xl md:text-2xl"
                />
                افزودن عکس محصول
              </label>
              <input
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  setProductImages([...productImages, e.target.files[0]]);
                  setIsProductImagesErrorShow(false);
                }}
              />
            </div>
            {isProductImagesErrorShow && (
              <p className="text-red-500 text-xs md:mr-4 mt-2">
                تصویر محصول اجباری است
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-6 text-xs md:text-base">
              {productImages?.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={
                      typeof image === "object"
                        ? URL.createObjectURL(image)
                        : `${uploadUrl}/products/${image}`
                    }
                    className="rounded w-[110px] h-[100px] object-contain"
                  />
                  <div
                    className="text-white bg-[#C92222] bg-opacity-90 absolute bottom-3 right-1/2 translate-x-1/2 rounded-sm flex px-0.5 cursor-pointer"
                    onClick={() => {
                      typeof image === "string" &&
                        setDeleteImages((prevValue) => [...prevValue, image]);

                      setProductImages(
                        productImages.filter((_, i) => i !== index),
                      );
                      productImages.length === 1 &&
                        setIsProductImagesErrorShow(true);
                    }}
                  >
                    حذف{" "}
                    <DeleteOutlinedIcon
                      fontSize=""
                      className="text-base md:text-2xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <form
              className="grid grid-cols-2 gap-y-4 md:gap-x-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="name" className="block text-sm font-bold">
                  نام محصول
                </label>
                <input
                  id="name"
                  type="text"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register("name", { required: true })}
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    نام محصول اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="product_code" className="block text-sm font-bold">
                  کد محصول
                </label>
                <input
                  id="product_code"
                  type="text"
                  placeholder="اختیاری"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register("product_code")}
                />
              </div>
              {/* <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="price" className="block text-sm font-bold">
                  قیمت محصول
                </label>
                <input
                  id="price"
                  type="number"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register("price", { required: true })}
                />
                {errors.price?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    قیمت محصول اجباری است
                  </p>
                )}
              </div> */}
              <div className="col-span-2 md:col-span-1 space-y-3">
                <label className="block text-sm font-bold text-gray-700">
                  قیمت محصول
                </label>

                <div className="border rounded-xl p-3 bg-gray-50 space-y-3">
                  {/* قیمت نهایی */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      قیمت پس از تخفیف
                    </label>
                    <input
                      id="totalPrice"
                      type="number"
                      placeholder="مثلا 120000"
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400"
                      {...register("totalPrice", { required: true })}
                    />
                  </div>

                  {/* قیمت اصلی */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      قیمت قبل از تخفیف
                    </label>
                    <input
                      id="price"
                      type="number"
                      placeholder="مثلا 150000"
                      className="w-full border rounded-lg px-3 py-2 text-sm text-gray-500 line-through outline-none focus:ring-2 focus:ring-gray-300"
                      {...register("price")}
                    />
                  </div>
                </div>

                {errors.price?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    قیمت نهایی اجباری است
                  </p>
                )}
              </div>
              {getValues("features")?.map((feature, index) => (
                <div
                  className="col-span-2 grid grid-cols-2 gap-y-4 md:gap-x-10 relative"
                  key={index}
                >
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label
                      htmlFor={`featureKey${index}`}
                      className="block text-sm font-bold"
                    >
                      نام ویژگی
                    </label>
                    <input
                      id={`featureKey${index}`}
                      type="text"
                      className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300 appearance-none"
                      {...register(`features[${index}].name`, {
                        required: true,
                      })}
                    />
                    {errors[`features${[index]}.name`]?.type === "required" && (
                      <p className="text-red-500 text-xs mr-2">
                        نام ویژگی اجباری است
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label
                      htmlFor={`featureValue${index}`}
                      className="block text-sm font-bold"
                    >
                      مقدار ویژگی
                    </label>
                    <input
                      id={`featureValue${index}`}
                      type="name"
                      className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                      {...register(`features[${index}].value`, {
                        required: true,
                      })}
                    />
                    {errors[`featureValue${index}`]?.type === "required" && (
                      <p className="text-red-500 text-xs mr-2">
                        مقدار ویژگی اجباری است
                      </p>
                    )}
                  </div>
                  <span
                    className="absolute -bottom-6 left-0 cursor-pointer text-red-500 text-sm md:text-base"
                    onClick={() => {
                      setValue(
                        "features",
                        getValues("features").filter((_, i) => i !== index),
                      );
                      setFlag(!flag);
                    }}
                  >
                    حذف
                    <DeleteOutlinedIcon
                      fontSize=""
                      className="text-base md:text-2xl"
                    />
                  </span>
                </div>
              ))}
              <div
                className="flex gap-2 items-center col-span-2 cursor-pointer w-fit"
                onClick={() => {
                  setValue("features", [
                    ...getValues("features"),
                    { name: "", value: "" },
                  ]);
                  setFlag(!flag);
                }}
              >
                <span className="p-[7px] text-white bg-[#004B8F] rounded-full">
                  <AddOutlinedIcon />
                </span>
                <span className="text-[#004B8F] font-bold">
                  افزودن ویژگی جدید
                </span>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="senf" className="block text-sm font-bold">
                  دسته بندی محصول
                </label>
                <div className="relative z-50">
                  <select
                    name=""
                    id="senf"
                    className="bg-transparent border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300 appearance-none"
                    {...register("senf", { required: true })}
                    onChange={(e) => senfChangeHandler(e.target.value)}
                  >
                    <option value=""> دسته بندی را انتخاب کنید</option>
                    {isGetAsnafPending && (
                      <option value="" className="text-black">
                        در حال دریافت دسته بندی ها ...
                      </option>
                    )}
                    {asnaf?.length || isGetAsnafPending ? (
                      asnaf?.map((senf) => (
                        <option key={senf.id} value={senf.id}>
                          {senf.name}
                        </option>
                      ))
                    ) : (
                      <option value="" className="text-black">
                        دسته بندی وجود ندارد.
                      </option>
                    )}
                  </select>
                  {errors.senf?.type === "required" && (
                    <p className="text-red-500 text-xs mr-2">
                      انتخاب دسته بندی اجباری است
                    </p>
                  )}
                  <label
                    htmlFor="senf"
                    className="absolute left-2 top-0.5 text-[#4b4b4b] -z-[1]"
                  >
                    <KeyboardArrowDownOutlinedIcon fontSize="large" />
                  </label>
                </div>
                {/* {errors.senf?.type === "required" && (
                <p className="text-red-500 text-xs mr-2">
                        نام ویژگی اجباری است
                </p>
              )} */}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label
                  htmlFor="subcategory"
                  className="block text-sm font-bold"
                >
                  زیردسته (اجباری)
                </label>
                <div className="relative z-50">
                  <select
                    name=""
                    id="subcategory"
                    className="bg-transparent border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300 appearance-none"
                    {...register("subcategory", { required: true })}
                  >
                    <option value="">زیردسته را انتخاب کنید</option>
                    {isGetSenfSubcategoriesPending && getValues("senf") && (
                      <option value="" className="text-black">
                        در حال دریافت زیردسته ها ...
                      </option>
                    )}
                    {senfSelectBoxValue ? (
                      senfSubcategories?.body?.length ||
                      isGetSenfSubcategoriesPending ? (
                        senfSubcategories?.body?.map((subcategory) => (
                          <option
                            key={subcategory.id}
                            value={subcategory.id}
                            className="text-black"
                          >
                            {subcategory.name}
                          </option>
                        ))
                      ) : (
                        <option value="" className="text-black">
                          زیردسته وجود ندارد.
                        </option>
                      )
                    ) : (
                      <option value="">ابتدا دسته بندی را انتخاب کنید</option>
                    )}
                  </select>
                  {errors.subcategory?.type === "required" && (
                    <p className="text-red-500 text-xs mr-2">
                      انتخاب زیردسته اجباری است
                    </p>
                  )}
                  <label
                    htmlFor="senf"
                    className="absolute left-2 top-0.5 text-[#4b4b4b] -z-[1]"
                  >
                    <KeyboardArrowDownOutlinedIcon fontSize="large" />
                  </label>
                </div>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="count" className="block text-sm font-bold">
                  تعداد محصول
                </label>
                <input
                  id="count"
                  type="number"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register("count", { required: true })}
                />
                {errors.count?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    تعداد محصول اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label htmlFor="brand_id" className="block text-sm font-bold">
                  برند (اختیاری)
                </label>
                <div className="relative z-50">
                  <select
                    id="brand_id"
                    className="bg-transparent border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300 appearance-none"
                    {...register("brand_id")}
                  >
                    <option value="">بدون برند</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="brand_id"
                    className="absolute left-2 top-0.5 text-[#4b4b4b] -z-[1] pointer-events-none"
                  >
                    <KeyboardArrowDownOutlinedIcon fontSize="large" />
                  </label>
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold"
                >
                  توضیحات محصول
                </label>
                <TiptapEditor
                  content={productData?.description}
                  onChange={(content) => {
                    setProductDescription(content);
                    content?.length >= 8
                      ? setIsProductDescriptionErrorShow(false)
                      : setIsProductDescriptionErrorShow(true);
                  }}
                />
                {isProductDescriptionErrorShow && (
                  <p className="text-red-500 text-xs mr-2">
                    توضیحات محصول اجباری است
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <button
                  className="bg-[#CA8549] text-white rounded-full py-2 w-3/4 md:w-2/4 block mx-auto mt-16"
                  onClick={() => {
                    productImages.length
                      ? setIsProductImagesErrorShow(false)
                      : setIsProductImagesErrorShow(true);

                    productDescription?.length >= 8
                      ? setIsProductDescriptionErrorShow(false)
                      : setIsProductDescriptionErrorShow(true);
                  }}
                >
                  ویرایش محصول
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProductModal;
