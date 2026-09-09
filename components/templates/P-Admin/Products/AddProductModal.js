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
import getBrands from "@/funcs/getBrands";
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

  const validateExtraFields = () => {
    const imagesValid = productImages.length > 0;
    const descriptionValid = productDescription?.length >= 8;

    setIsProductImagesErrorShow(!imagesValid);
    setIsProductDescriptionErrorShow(!descriptionValid);

    return imagesValid && descriptionValid;
  };

  const onSubmit = (data) => {
    if (!validateExtraFields()) {
      document.getElementById("addProductModal")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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
      weight_kg: data.weight_kg,
      brand_id: data.brand_id || "",
    }).then(() => setIsLoading(false));
  };

  const onInvalid = () => {
    validateExtraFields();
    document.getElementById("addProductModal")?.scrollTo({ top: 0, behavior: "smooth" });
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
    getBrands(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res?.status) setBrands(res.body || []);
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

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-brand-navy">تصاویر محصول</span>
                  {productImages.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {productImages.length.toLocaleString("fa-IR")} تصویر انتخاب شده
                    </span>
                  )}
                </div>

                {productImages.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {productImages.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="relative shrink-0 rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                          alt=""
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = productImages.filter((_, i) => i !== index);
                            setProductImages(next);
                            if (!next.length) setIsProductImagesErrorShow(true);
                          }}
                          className="absolute -top-2 -left-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                          aria-label="حذف تصویر"
                        >
                          <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 right-2 text-[10px] font-medium bg-[#CA8549] text-white px-1.5 py-0.5 rounded-md">
                            اصلی
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <label
                  htmlFor="image"
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 cursor-pointer transition-colors ${
                    isProductImagesErrorShow
                      ? "border-red-300 bg-red-50/40 hover:border-red-400"
                      : "border-gray-200 bg-gray-50/70 hover:border-[#CA8549]/40 hover:bg-[#CA8549]/[0.03]"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      isProductImagesErrorShow ? "bg-red-100" : "bg-[#CA8549]/10"
                    }`}
                  >
                    <AddPhotoAlternateOutlinedIcon
                      className={isProductImagesErrorShow ? "text-red-500" : "text-[#CA8549]"}
                      sx={{ fontSize: 28 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-brand-navy">
                    {productImages.length ? "افزودن تصویر دیگر" : "انتخاب تصویر محصول"}
                  </span>
                  <span className="text-xs text-gray-500 text-center leading-6">
                    فرمت‌های JPG، PNG و WebP · حداقل یک تصویر الزامی است
                  </span>
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setProductImages((prev) => [...prev, file]);
                      setIsProductImagesErrorShow(false);
                      e.target.value = "";
                    }}
                  />
                </label>

                {isProductImagesErrorShow && (
                  <p className="text-red-600 text-xs mr-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    لطفاً حداقل یک تصویر برای محصول انتخاب کنید.
                  </p>
                )}
              </div>

              <div className="mt-2">
                <form
                  className="grid grid-cols-2 gap-y-4 md:gap-x-10"
                  onSubmit={handleSubmit(onSubmit, onInvalid)}
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
                        {errors.features?.[index]?.name?.type === "required" && (
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
                          type="text"
                          className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                          {...register(`features[${index}].value`, {
                            required: true,
                          })}
                        />
                        {errors.features?.[index]?.value?.type === "required" && (
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
                      <label
                        htmlFor="senf"
                        className="absolute left-2 top-0.5 text-[#4b4b4b] -z-[1] pointer-events-none"
                      >
                        <KeyboardArrowDownOutlinedIcon fontSize="large" />
                      </label>
                    </div>
                    {errors.senf?.type === "required" && (
                      <p className="text-red-500 text-xs mr-2">
                        انتخاب دسته بندی اجباری است
                      </p>
                    )}
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
                      <label
                        htmlFor="subcategory"
                        className="absolute left-2 top-0.5 text-[#4b4b4b] -z-[1] pointer-events-none"
                      >
                        <KeyboardArrowDownOutlinedIcon fontSize="large" />
                      </label>
                    </div>
                    {errors.subcategory?.type === "required" && (
                      <p className="text-red-500 text-xs mr-2">
                        انتخاب زیردسته اجباری است
                      </p>
                    )}
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
                    <label htmlFor="weight_kg" className="block text-sm font-bold">
                      وزن (کیلوگرم)
                    </label>
                    <input
                      id="weight_kg"
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="مثلاً 0.200"
                      className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                      {...register("weight_kg", {
                        required: true,
                        min: 0,
                        setValueAs: (v) => {
                          if (v === "" || v === null) return v;
                          const n = Number(v);
                          if (!Number.isFinite(n) || n < 0) return 0;
                          return Math.round(n * 1000) / 1000;
                        },
                      })}
                    />
                    <p className="text-xs text-gray-500 mr-1">تا ۳ رقم اعشار — مثلاً 0.200 یعنی ۲۰۰ گرم</p>
                    {errors.weight_kg?.type === "required" && (
                      <p className="text-red-500 text-xs mr-2">وزن محصول اجباری است</p>
                    )}
                    {errors.weight_kg?.type === "min" && (
                      <p className="text-red-500 text-xs mr-2">وزن نمی‌تواند منفی باشد</p>
                    )}
                  </div>

                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label htmlFor="brand_id" className="block text-sm font-bold">
                      برند
                    </label>
                    <div className="relative z-50">
                      <select
                        id="brand_id"
                        className="bg-transparent border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300 appearance-none"
                        defaultValue=""
                        {...register("brand_id", { required: true })}
                      >
                        <option value="">انتخاب برند</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={String(brand.id)}>
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
                    {errors.brand_id?.type === "required" && (
                      <p className="text-red-500 text-xs mr-2">انتخاب برند اجباری است</p>
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
