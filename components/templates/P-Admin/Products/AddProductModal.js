"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import getAsnaf from "@/funcs/getAsnaf";
import getCookie from "@/funcs/cookies/getCookie";
import createProduct from "@/funcs/createProduct";
import checkProductCode from "@/funcs/checkProductCode";
import Loader from "@/components/modules/Loader";
import getSenfSubcategories from "@/funcs/getSenfSubcategories";
import TiptapEditor from "@/components/modules/TiptapEditor";
import { uploadUrl, siteUrl } from "@/data/variables";
import Link from "next/link";

function DuplicateProductCard({ product }) {
  const displayPrice =
    product?.totalPrice > 0 ? product.totalPrice : product?.price;

  return (
    <div className="mt-4 border border-red-100 rounded-xl bg-red-50/40 p-3 text-right">
      <p className="text-red-600 text-xs font-bold mb-3 text-center">
        محصول ثبت‌شده با این کد
      </p>
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
        <img
          src={`${uploadUrl}/products/${product?.images_path?.[0]}`}
          alt={product?.name}
          className="w-16 h-16 object-contain flex-shrink-0 rounded-lg bg-gray-50"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-6">
            {product?.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            دسته: {product?.senf?.name || "—"}
          </p>
          <p className="text-sm font-bold text-[#119E30] mt-1">
            {Number(displayPrice || 0).toLocaleString("fa-IR")}{" "}
            <span className="text-[10px] text-gray-400 font-normal">تومان</span>
          </p>
        </div>
      </div>
      <Link
        href={`${siteUrl}/product/${product?.id}`}
        target="_blank"
        className="mt-3 flex items-center justify-center gap-1 text-xs text-[#CA8549] hover:text-[#b8743f] font-medium"
      >
        مشاهده در سایت
        <OpenInNewOutlinedIcon sx={{ fontSize: 14 }} />
      </Link>
    </div>
  );
}

function AddProductModal({ setIsAddProductModalShow }) {
  const [step, setStep] = useState(1);
  const [confirmedProductCode, setConfirmedProductCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [duplicateProduct, setDuplicateProduct] = useState(null);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [isProductImagesErrorShow, setIsProductImagesErrorShow] =
    useState(false);
  const [asnaf, setAsnaf] = useState([]);
  const [isGetAsnafPending, setIsGetAsnafPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [senfSubcategories, setSenfSubcategories] = useState([]);
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
    getValues,
    setValue,
    setError,
  } = useForm();

  const handleCodeContinue = async () => {
    const normalized = codeInput.trim();
    if (!normalized) {
      setCodeError("کد محصول را وارد کنید");
      return;
    }

    setCodeError("");
    setDuplicateProduct(null);
    setIsCheckingCode(true);
    try {
      const res = await checkProductCode(normalized);
      if (res?.status && res?.available) {
        setConfirmedProductCode(normalized);
        setValue("product_code", normalized);
        setStep(2);
      } else {
        setDuplicateProduct(res?.product || null);
        setCodeError(
          res?.message === "This route is not in my api"
            ? "سرور API به‌روز نیست. لطفاً API را restart کنید."
            : res?.message || "این کد محصول قبلاً ثبت شده است"
        );
      }
    } catch {
      setCodeError("خطا در بررسی کد محصول. دوباره تلاش کنید");
    } finally {
      setIsCheckingCode(false);
    }
  };

  const onSubmit = (data) => {
    if (productImages.length && productDescription?.length >= 8) {
      setIsLoading(true);
      createProduct({
        name: data.name,
        product_code: confirmedProductCode,
        senf_id: data.subcategory || data.senf,
        price: data.price,
        description: productDescription,
        features: data.features || [],
        images: productImages,
        count: data.count,
      }).then(() => setIsLoading(false));
    } else {
      document.getElementById("addProductModal")?.scrollTo(0, 0);
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
      value || undefined
    ).then((res) => {
      setSenfSubcategories(res);
      setisGetSenfSubcategoriesPending(false);
    });
  };

  useEffect(() => {
    if (step !== 2) return;
    setIsGetAsnafPending(true);
    getAsnaf(getCookie("ramian-pakhsh-admin")).then((res) => {
      setAsnaf(res.body);
      setIsGetAsnafPending(false);
    });
  }, [step]);

  return (
    <>
      {(isLoading || isCheckingCode) && <Loader />}
      <div className="admin-modal-overlay">
        <div className="flex min-h-full items-center justify-center p-4">
        <div
          id="addProductModal"
          className={`bg-white rounded-xl mx-2 relative shrink-0 ${
            step === 1
              ? "w-[340px] max-w-[92vw] h-fit p-4 pb-4"
              : "w-[900px] max-w-[95vw] max-h-[90vh] overflow-auto p-5 pb-14"
          }`}
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsAddProductModalShow(false)}
          >
            <CloseIcon />
          </div>

          {step === 1 ? (
            <div className="pt-6 px-1">
              <div className="text-center">
                <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-[#CA8549]/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#CA8549]">#</span>
                </div>
                <p className="text-[#CA8549] text-[11px] font-medium mb-1">
                  مرحله ۱ از ۲
                </p>
                <h2 className="text-base font-bold text-gray-800 mb-1">
                  کد محصول
                </h2>
                <p className="text-gray-500 text-xs leading-6 mb-4">
                  کد را وارد کنید تا تکراری نبودن بررسی شود.
                </p>
              </div>

              <div className="space-y-3 text-right">
                <label
                  htmlFor="product_code_step"
                  className="block text-xs font-bold text-gray-700"
                >
                  کد محصول
                </label>
                <input
                  id="product_code_step"
                  type="text"
                  autoFocus
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setCodeError("");
                    setDuplicateProduct(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCodeContinue();
                    }
                  }}
                  placeholder="مثال: 10453"
                  className="w-full border border-gray-200 focus:border-[#CA8549] focus:ring-2 focus:ring-[#CA8549]/20 rounded-xl px-3 py-3 text-base font-semibold text-gray-800 outline-none transition-all text-center tracking-wider"
                />
                {codeError && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-red-600 text-xs text-center">
                    {codeError}
                  </div>
                )}
                {duplicateProduct && (
                  <DuplicateProductCard product={duplicateProduct} />
                )}
                <button
                  type="button"
                  onClick={handleCodeContinue}
                  disabled={isCheckingCode || !codeInput.trim()}
                  className="w-full bg-[#CA8549] hover:bg-[#b8743f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-bold transition-colors"
                >
                  {isCheckingCode ? "در حال بررسی..." : "بررسی و ادامه"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 pt-2 pr-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-[#CA8549] hover:text-[#b8743f] font-medium"
                >
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  تغییر کد محصول
                </button>
                <div className="mt-3 inline-flex items-center gap-2 bg-[#CA8549]/10 text-[#CA8549] rounded-xl px-4 py-2 text-sm font-bold">
                  <span className="text-gray-500 font-normal">کد محصول:</span>
                  {confirmedProductCode}
                </div>
              </div>

              <div>
                <div>
                  <label
                    htmlFor="image"
                    className="w-fit text-white bg-black text-xs md:text-sm rounded-full px-3 py-3 md:mr-4 flex items-center gap-2 cursor-pointer"
                  >
                    <AddPhotoAlternateOutlinedIcon className="text-xl md:text-2xl" />
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
                <div className="flex flex-wrap gap-2 mt-6 text-sm md:text-base">
                  {productImages?.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        className="rounded w-[110px] h-[100px] object-contain"
                        alt=""
                      />
                      <div
                        className="text-white bg-[#C92222] bg-opacity-90 absolute bottom-3 right-1/2 translate-x-1/2 rounded-sm flex px-0.5 cursor-pointer"
                        onClick={() => {
                          setProductImages(
                            productImages.filter((_, i) => i !== index)
                          );
                          productImages.length === 1 &&
                            setIsProductImagesErrorShow(true);
                        }}
                      >
                        حذف <DeleteOutlinedIcon className="text-base md:text-2xl" />
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
                  <input type="hidden" {...register("product_code")} />

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
                          type="text"
                          className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                          {...register(`features[${index}].value`, {
                            required: true,
                          })}
                        />
                      </div>
                      <span
                        className="absolute -bottom-6 left-0 cursor-pointer text-red-500 text-sm md:text-base"
                        onClick={() => {
                          setValue(
                            "features",
                            getValues("features").filter((_, i) => i !== index)
                          );
                          setFlag(!flag);
                        }}
                      >
                        حذف <DeleteOutlinedIcon className="text-base md:text-2xl" />
                      </span>
                    </div>
                  ))}

                  <div
                    className="flex gap-2 items-center col-span-2 cursor-pointer w-fit"
                    onClick={() => {
                      setValue("features", [
                        ...(getValues("features") || []),
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
                        id="senf"
                        className="bg-transparent border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300 appearance-none"
                        {...register("senf", { required: true })}
                        onChange={(e) => senfChangeHandler(e.target.value)}
                      >
                        <option value="">دسته بندی را انتخاب کنید</option>
                        {isGetAsnafPending && (
                          <option value="">در حال دریافت دسته بندی ها ...</option>
                        )}
                        {asnaf?.map((senf) => (
                          <option key={senf.id} value={senf.id}>
                            {senf.name}
                          </option>
                        ))}
                      </select>
                      {errors.senf?.type === "required" && (
                        <p className="text-red-500 text-xs mr-2">
                          انتخاب دسته بندی اجباری است
                        </p>
                      )}
                      <label
                        htmlFor="senf"
                        className="absolute left-2 top-0.5 text-[#4b4b4b] -z-[1] pointer-events-none"
                      >
                        <KeyboardArrowDownOutlinedIcon fontSize="large" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label htmlFor="subcategory" className="block text-sm font-bold">
                      زیردسته (اختیاری)
                    </label>
                    <div className="relative z-50">
                      <select
                        id="subcategory"
                        className="bg-transparent border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300 appearance-none"
                        {...register("subcategory", { required: true })}
                      >
                        <option value="">زیردسته را انتخاب کنید</option>
                        {senfSubcategories?.body?.map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                      {errors.subcategory?.type === "required" && (
                        <p className="text-red-500 text-xs mr-2">
                          انتخاب زیردسته اجباری است
                        </p>
                      )}
                      <label
                        htmlFor="subcategory"
                        className="absolute left-2 top-0.5 text-[#4b4b4b] -z-[1] pointer-events-none"
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

                  <div className="space-y-2 col-span-2">
                    <label htmlFor="description" className="block text-sm font-bold">
                      توضیحات محصول
                    </label>
                    <TiptapEditor
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
                      type="submit"
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
                      ثبت محصول
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </>
  );
}

export default AddProductModal;
