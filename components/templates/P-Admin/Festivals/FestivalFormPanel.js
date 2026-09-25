"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";

import SearchIcon from "@mui/icons-material/Search";

import { useForm } from "react-hook-form";

import Loader from "@/components/modules/Loader";

import PersianDateField from "@/components/templates/P-Admin/Articles/PersianDateField";

import { IRAN_LOCATIONS } from "@/data/iranLocations";

import getSearchProducts from "@/funcs/getSearchProducts";
import getAsnaf from "@/funcs/getAsnaf";
import getSenfSubcategories from "@/funcs/getSenfSubcategories";
import getProducts from "@/funcs/getProducts";
import getCookie from "@/funcs/cookies/getCookie";

import createFestival from "@/funcs/createFestival";

import editFestival from "@/funcs/editFestival";

import { uploadUrl } from "@/data/variables";

function normalizeAmountDigits(value) {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const normalized = String(value)
    .split("")
    .map((char) => {
      const persianIndex = persian.indexOf(char);
      if (persianIndex >= 0) return String(persianIndex);
      const arabicIndex = arabic.indexOf(char);
      if (arabicIndex >= 0) return String(arabicIndex);
      return char;
    })
    .join("");
  return normalized.replace(/[^\d]/g, "");
}

function formatAmountThousands(digits) {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function FestivalFormPanel({ onClose, festival, onSaved }) {

  const panelRef = useRef(null);

  const isEdit = Boolean(festival?.id);

  const [isLoading, setIsLoading] = useState(false);

  const [startsAt, setStartsAt] = useState(

    festival?.starts_at ? new Date(festival.starts_at) : null

  );

  const [endsAt, setEndsAt] = useState(

    festival?.ends_at ? new Date(festival.ends_at) : null

  );

  const [selectedProvince, setSelectedProvince] = useState("");

  const [selectedCities, setSelectedCities] = useState(festival?.city_names || []);

  const [selectedProducts, setSelectedProducts] = useState(festival?.products || []);

  const [searchValue, setSearchValue] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [searching, setSearching] = useState(false);
  const [asnaf, setAsnaf] = useState([]);
  const [selectedSenf, setSelectedSenf] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);
  const [categoryLoaded, setCategoryLoaded] = useState(false);

  const [formError, setFormError] = useState("");



  const {

    register,

    handleSubmit,

    setValue,

    formState: { errors },

  } = useForm({

    defaultValues: {

      name: festival?.name || "",

      description: festival?.description || "",

      min_cart_amount: Number(festival?.min_cart_amount) || "",

      is_active: festival?.is_active !== false,

    },

  });

  const [minCartDisplay, setMinCartDisplay] = useState(() => {
    const digits = normalizeAmountDigits(String(festival?.min_cart_amount ?? ""));
    return formatAmountThousands(digits);
  });

  useEffect(() => {
    register("min_cart_amount", {
      required: true,
      validate: (value) => Number(value) >= 1 || "invalid",
    });
  }, [register]);

  const handleMinCartAmountChange = (rawValue) => {
    const digits = normalizeAmountDigits(rawValue);
    if (!digits) {
      setMinCartDisplay("");
      setValue("min_cart_amount", "", { shouldValidate: true });
      return;
    }
    const numeric = Number(digits);
    setMinCartDisplay(formatAmountThousands(digits));
    setValue("min_cart_amount", numeric, { shouldValidate: true });
  };



  const cities = useMemo(() => {

    const match = IRAN_LOCATIONS.find((item) => item.province === selectedProvince);

    return match?.cities || [];

  }, [selectedProvince]);



  useEffect(() => {

    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  }, [festival?.id]);

  useEffect(() => {
    getAsnaf(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res?.status) setAsnaf(res.body || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedSenf) {
      setSubcategories([]);
      setSelectedSubcategory("");
      setCategoryProducts([]);
      setCategoryLoaded(false);
      return;
    }

    getSenfSubcategories(getCookie("ramian-pakhsh-admin"), selectedSenf).then((res) => {
      setSubcategories(res?.body || []);
      setSelectedSubcategory("");
      setCategoryProducts([]);
      setCategoryLoaded(false);
    });
  }, [selectedSenf]);

  useEffect(() => {

    const query = searchValue.trim();

    if (query.length < 2) {

      setSearchResults([]);

      return;

    }



    const timer = setTimeout(async () => {

      setSearching(true);

      const res = await getSearchProducts({ name: query }, 0, 8);

      setSearchResults(res?.body?.rows || []);

      setSearching(false);

    }, 350);



    return () => clearTimeout(timer);

  }, [searchValue]);



  const addCity = (city) => {

    if (!city || selectedCities.includes(city)) return;

    setSelectedCities((prev) => [...prev, city]);

  };



  const removeCity = (city) => {

    setSelectedCities((prev) => prev.filter((item) => item !== city));

  };



  const addProduct = (product) => {

    if (!product?.id) return;

    setSelectedProducts((prev) => {

      if (prev.some((item) => item.id === product.id)) return prev;

      return [...prev, product];

    });

    setSearchValue("");

    setSearchResults([]);

  };



  const removeProduct = (productId) => {

    setSelectedProducts((prev) => prev.filter((item) => item.id !== productId));

  };

  const isProductSelected = (productId) =>
    selectedProducts.some((item) => item.id === productId);

  const mergeProductsIntoSelection = (products) => {
    setSelectedProducts((prev) => {
      const ids = new Set(prev.map((item) => item.id));
      const next = [...prev];
      for (const product of products) {
        if (product?.id && !ids.has(product.id)) {
          ids.add(product.id);
          next.push(product);
        }
      }
      return next;
    });
  };

  const toggleCategoryProduct = (product, checked) => {
    if (checked) addProduct(product);
    else removeProduct(product.id);
  };

  const loadCategoryProducts = async () => {
    if (!selectedSenf && !selectedSubcategory) return;

    setLoadingCategoryProducts(true);
    setCategoryLoaded(false);
    const res = await getProducts(getCookie("ramian-pakhsh-admin"), 0, 40, {
      senf_id: selectedSenf,
      subcategory_id: selectedSubcategory,
    });
    const rows = res?.body?.rows || (Array.isArray(res?.body) ? res.body : []);
    setCategoryProducts(rows);
    mergeProductsIntoSelection(rows);
    setCategoryLoaded(true);
    setLoadingCategoryProducts(false);
  };

  const renderCategoryProductRow = (product) => {
    const checked = isProductSelected(product.id);
    return (
      <label
        key={product.id}
        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-gray-50"
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => toggleCategoryProduct(product, e.target.checked)}
          className="h-4 w-4 shrink-0 accent-[#CA8549]"
        />
        <img
          src={`${uploadUrl}/products/${product.images_path?.[0] || ""}`}
          alt=""
          className="h-10 w-10 rounded-lg object-contain bg-gray-50"
        />
        <span className="min-w-0 flex-1 truncate text-sm">{product.name}</span>
      </label>
    );
  };

  const renderProductPickButton = (product) => {
    const picked = isProductSelected(product.id);
    return (
      <button
        type="button"
        key={product.id}
        onClick={() => addProduct(product)}
        disabled={picked}
        className={`flex w-full items-center gap-3 px-3 py-2 text-right transition-colors ${
          picked ? "cursor-default bg-emerald-50/80" : "hover:bg-gray-50"
        }`}
      >
        <img
          src={`${uploadUrl}/products/${product.images_path?.[0] || ""}`}
          alt=""
          className="h-10 w-10 rounded-lg object-contain bg-gray-50"
        />
        <span className="min-w-0 flex-1 truncate text-sm">{product.name}</span>
        <span
          className={`shrink-0 text-[11px] font-medium ${
            picked ? "text-emerald-700" : "text-[#CA8549]"
          }`}
        >
          {picked ? "انتخاب شده" : "افزودن"}
        </span>
      </button>
    );
  };



  const onSubmit = async (data) => {

    setFormError("");

    if (!startsAt || !endsAt) {

      setFormError("تاریخ شروع و پایان را مشخص کنید");

      return;

    }

    if (!selectedCities.length) {

      setFormError("حداقل یک شهر را انتخاب کنید");

      return;

    }

    if (!selectedProducts.length) {

      setFormError("حداقل یک محصول را انتخاب کنید");

      return;

    }



    const payload = {

      name: data.name,

      description: data.description,

      min_cart_amount: Number(data.min_cart_amount),

      starts_at: startsAt,

      ends_at: endsAt,

      is_active: Boolean(data.is_active),

      city_names: selectedCities,

      product_ids: selectedProducts.map((item) => item.id),

    };



    setIsLoading(true);

    const res = isEdit

      ? await editFestival(payload, festival.id)

      : await createFestival(payload);

    setIsLoading(false);



    if (res?.status) {

      onSaved?.();

      onClose?.();

    }

  };



  return (

    <div ref={panelRef} className="mb-6">

      {isLoading && <Loader />}

      <div className="admin-card overflow-hidden border-2 border-[#CA8549]/25 !p-0">

        <div className="flex items-start justify-between gap-3 border-b border-gray-100 bg-gradient-to-l from-[#253c8a]/5 to-[#CA8549]/10 px-5 py-4 md:px-6">

          <div>

            <h2 className="text-base font-bold text-brand-navy md:text-lg">

              {isEdit ? "ویرایش جشنواره" : "ایجاد جشنواره جدید"}

            </h2>

            {isEdit ? (

              <p className="mt-1 text-xs text-gray-500">{festival.name}</p>

            ) : (

              <p className="mt-1 text-xs text-gray-500">

                شهر، محصولات و بازه زمانی را مشخص کنید

              </p>

            )}

          </div>

          <button

            type="button"

            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"

            onClick={onClose}

            aria-label="بستن فرم"

          >

            <CloseIcon fontSize="small" />

          </button>

        </div>



        <form className="space-y-5 px-5 py-5 md:px-6 md:py-6" onSubmit={handleSubmit(onSubmit)}>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">

              <label className="block text-sm font-bold">نام جشنواره</label>

              <input

                type="text"

                className="admin-input"

                {...register("name", { required: true, minLength: 2 })}

              />

              {errors.name && (

                <p className="text-xs text-red-500">نام جشنواره اجباری است</p>

              )}

            </div>

            <div className="space-y-2">

              <label className="block text-sm font-bold">حداقل مبلغ سبد (تومان)</label>

              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                className="admin-input text-left"
                value={minCartDisplay}
                onChange={(e) => handleMinCartAmountChange(e.target.value)}
                placeholder="مثلاً 500,000"
              />

              {errors.min_cart_amount && (

                <p className="text-xs text-red-500">مبلغ حداقل سبد اجباری است</p>

              )}

            </div>

          </div>



          <div className="space-y-2">

            <label className="block text-sm font-bold">توضیح (اختیاری)</label>

            <textarea

              rows={3}

              className="admin-input !rounded-xl"

              {...register("description")}

            />

          </div>



          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">

              <label className="block text-sm font-bold">تاریخ شروع</label>

              <PersianDateField

                value={startsAt}

                onChange={setStartsAt}

                placeholder="انتخاب تاریخ شروع"

              />

            </div>

            <div className="space-y-2">

              <label className="block text-sm font-bold">تاریخ پایان</label>

              <PersianDateField

                value={endsAt}

                onChange={setEndsAt}

                placeholder="انتخاب تاریخ پایان"

              />

            </div>

          </div>



          {isEdit && (

            <label className="flex items-center gap-2 text-sm font-bold">

              <input type="checkbox" {...register("is_active")} />

              جشنواره فعال باشد

            </label>

          )}



          <div className="rounded-xl border border-gray-100 p-4">

            <h3 className="mb-3 text-sm font-bold">شهرهای جشنواره</h3>

            <div className="grid gap-3 md:grid-cols-2">

              <select

                className="admin-input"

                value={selectedProvince}

                onChange={(e) => setSelectedProvince(e.target.value)}

              >

                <option value="">انتخاب استان</option>

                {IRAN_LOCATIONS.map((item) => (

                  <option key={item.province} value={item.province}>

                    {item.province}

                  </option>

                ))}

              </select>

              <select

                className="admin-input"

                disabled={!selectedProvince}

                value=""

                onChange={(e) => addCity(e.target.value)}

              >

                <option value="">افزودن شهر</option>

                {cities.map((city) => (

                  <option key={city} value={city} disabled={selectedCities.includes(city)}>

                    {city}

                  </option>

                ))}

              </select>

            </div>

            <div className="mt-3 flex flex-wrap gap-2">

              {selectedCities.length ? (

                selectedCities.map((city) => (

                  <button

                    type="button"

                    key={city}

                    onClick={() => removeCity(city)}

                    className="rounded-full border border-[#CA8549]/30 bg-[#CA8549]/10 px-3 py-1 text-xs text-[#8a5a2b]"

                  >

                    {city} ×

                  </button>

                ))

              ) : (

                <p className="text-xs text-gray-400">هنوز شهری انتخاب نشده است</p>

              )}

            </div>

          </div>



          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-navy">محصولات جشنواره</h3>

            <div className="rounded-xl border border-dashed border-[#253c8a]/25 bg-slate-50/90 p-4 md:p-5">
              <div className="mb-4 border-b border-[#253c8a]/10 pb-3">
                <p className="text-sm font-bold text-[#253c8a]">۱. انتخاب و افزودن محصول</p>
                <p className="mt-1 text-xs text-gray-500">
                  با جستجو یا دسته‌بندی محصول پیدا کنید؛ در لیست دسته با تیک انتخاب می‌شود
                </p>
              </div>

              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  fontSize="small"
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="جستجوی نام محصول..."
                  className="admin-input border-white bg-white pr-10"
                />
              </div>

              {(searching || searchResults.length > 0) && (
                <div className="mt-2 max-h-48 overflow-auto rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
                  {searching && (
                    <p className="px-3 py-2 text-xs text-gray-400">در حال جستجو...</p>
                  )}
                  {searchResults.map((product) => renderProductPickButton(product))}
                </div>
              )}

              <div className="mt-4 rounded-xl border border-[#253c8a]/10 bg-white/80 p-3 md:p-4">
                <p className="mb-3 text-xs font-bold text-gray-700">انتخاب بر اساس دسته</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <select
                    className="admin-input bg-white"
                    value={selectedSenf}
                    onChange={(e) => setSelectedSenf(e.target.value)}
                  >
                    <option value="">دسته‌بندی</option>
                    {asnaf.map((senf) => (
                      <option key={senf.id} value={senf.id}>
                        {senf.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="admin-input bg-white"
                    value={selectedSubcategory}
                    disabled={!selectedSenf}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                  >
                    <option value="">همه زیردسته‌ها</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="admin-btn-secondary !border-[#253c8a]/20 !bg-white !py-2 text-sm disabled:opacity-50"
                    disabled={!selectedSenf || loadingCategoryProducts}
                    onClick={loadCategoryProducts}
                  >
                    {loadingCategoryProducts ? "در حال بارگذاری..." : "نمایش محصولات دسته"}
                  </button>
                </div>

                {categoryProducts.length > 0 && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-[#253c8a]/15">
                    <div className="border-b border-[#253c8a]/10 bg-[#253c8a]/5 px-3 py-2 text-[11px] font-bold text-[#253c8a]">
                      محصولات این دسته — همه به‌صورت پیش‌فرض تیک‌خورده‌اند
                    </div>
                    <div className="max-h-56 divide-y divide-gray-100 overflow-auto bg-white">
                      {categoryProducts.map((product) => renderCategoryProductRow(product))}
                    </div>
                  </div>
                )}
                {selectedSenf && !loadingCategoryProducts && !categoryLoaded && (
                  <p className="mt-3 text-xs text-gray-400">
                    برای دیدن لیست، «نمایش محصولات دسته» را بزنید
                  </p>
                )}
                {categoryLoaded && !categoryProducts.length && (
                  <p className="mt-3 text-xs text-gray-400">محصولی در این دسته یافت نشد</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#CA8549]/35 bg-gradient-to-b from-[#CA8549]/8 via-white to-white p-4 md:p-5 shadow-sm shadow-[#CA8549]/5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#CA8549]/20 pb-3">
                <div>
                  <p className="text-sm font-bold text-[#5c3d1e]">۲. محصولات انتخاب‌شده برای جشنواره</p>
                  <p className="mt-1 text-xs text-gray-600">
                    فقط این کالاها در صفحه جشنواره و ارسال رایگان لحاظ می‌شوند
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#CA8549]/15 px-3 py-1 text-xs font-bold text-[#8a5524]">
                  {selectedProducts.length.toLocaleString("fa-IR")} محصول
                </span>
              </div>

              {selectedProducts.length ? (
                <div className="max-h-64 space-y-2 overflow-auto">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#CA8549]/20 bg-white px-3 py-2.5 shadow-sm"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#CA8549]/10 text-[#CA8549]">
                          ✓
                        </span>
                        <img
                          src={`${uploadUrl}/products/${product.images_path?.[0] || ""}`}
                          alt=""
                          className="h-10 w-10 rounded-lg object-contain bg-gray-50"
                        />
                        <span className="truncate text-sm font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                        onClick={() => removeProduct(product.id)}
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#CA8549]/30 bg-white/70 px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">هنوز محصولی به جشنواره اضافه نشده است</p>
                  <p className="mt-1 text-xs text-gray-400">
                    از بخش بالا جستجو کنید یا دسته را انتخاب کنید
                  </p>
                </div>
              )}
            </div>
          </div>



          {formError && <p className="text-sm text-red-500">{formError}</p>}



          <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">

            <button type="submit" className="admin-btn-primary !px-6 !py-2 text-sm">

              {isEdit ? "ذخیره تغییرات" : "ثبت جشنواره"}

            </button>

            <button

              type="button"

              className="admin-btn-secondary !px-6 !py-2 text-sm"

              onClick={onClose}

            >

              انصراف

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}



export default FestivalFormPanel;

