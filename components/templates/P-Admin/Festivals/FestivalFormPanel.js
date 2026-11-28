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
import { buildFestivalFormData } from "@/funcs/buildFestivalFormData";
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

function toTimeValue(date, fallback) {
  if (!date) return fallback;
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return fallback;
  return `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
}

// تاریخ انتخاب‌شده + ساعت (به وقت مرورگر مدیر) => زمان دقیق
function combineDateAndTime(date, time) {
  if (!date) return null;
  const value = new Date(date);
  const [hours, minutes] = String(time || "00:00").split(":").map(Number);
  value.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return value;
}

const toFaDigits = (value) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
const pad2 = (value) => String(value).padStart(2, "0");

function hourHint(hour) {
  const h = Number(hour);
  if (h < 5) return "بامداد";
  if (h < 12) return "صبح";
  if (h < 14) return "ظهر";
  if (h < 18) return "بعدازظهر";
  return "شب";
}

// خانه عددی دو رقمی برای ساعت/دقیقه؛ اعداد فارسی هم پذیرفته می‌شوند
function TimeNumberInput({ value, max, onChange, onFilled, inputRef, ariaLabel }) {
  const [draft, setDraft] = useState(value);
  const focusedRef = useRef(false);

  // تا وقتی کاربر در حال تایپ است، متن خانه با مقدار فرم بازنویسی نمی‌شود
  useEffect(() => {
    if (!focusedRef.current) setDraft(value);
  }, [value]);

  const handleChange = (raw, typed) => {
    let digits = normalizeAmountDigits(raw);
    if (digits.length > 2) {
      // بیش از دو رقم: رقم تازه به انتهای مقدار قبلی اضافه می‌شود (هر جای خانه که تایپ شده باشد)
      const typedDigit = normalizeAmountDigits(typed || "");
      digits = typedDigit ? `${draft}${typedDigit}` : digits;
    }
    digits = digits.slice(-2);
    setDraft(digits);
    if (digits === "") return;
    const number = Math.min(Number(digits), max);
    onChange(pad2(number));
    if (digits.length === 2) onFilled?.();
  };

  const handleBlur = (event) => {
    focusedRef.current = false;
    // مقدار فعلی خود خانه خوانده می‌شود (نه draft قدیمی) چون پرش خودکار به دقیقه هم blur می‌دهد
    const digits = normalizeAmountDigits(event.target.value).slice(-2);
    const number = digits === "" ? 0 : Math.min(Number(digits), max);
    const next = pad2(number);
    setDraft(next);
    onChange(next);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={draft}
      onChange={(e) => handleChange(e.target.value, e.nativeEvent?.data)}
      onFocus={(e) => {
        focusedRef.current = true;
        e.target.select();
      }}
      onBlur={handleBlur}
      aria-label={ariaLabel}
      placeholder="00"
      className="w-12 rounded-lg border border-gray-200 bg-white py-2 text-center text-sm font-bold outline-none hover:border-[#CA8549]/60 focus:border-[#CA8549]"
    />
  );
}

// ساعت ۲۴ ساعته (بدون AM/PM) که مستقیم تایپ می‌شود
function TimeField({ value, onChange, label }) {
  const [hour = "00", minute = "00"] = String(value || "00:00").split(":");
  const minuteRef = useRef(null);

  return (
    <div className="shrink-0" role="group" aria-label={label}>
      <div dir="ltr" className="flex items-end gap-1">
        <label className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-gray-500">ساعت</span>
          <TimeNumberInput
            value={hour}
            max={23}
            onChange={(h) => onChange(`${h}:${minute}`)}
            onFilled={() => minuteRef.current?.focus()}
            ariaLabel={`${label} - ساعت`}
          />
        </label>
        <span className="pb-2 text-sm font-bold text-gray-400">:</span>
        <label className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-gray-500">دقیقه</span>
          <TimeNumberInput
            value={minute}
            max={59}
            onChange={(m) => onChange(`${hour}:${m}`)}
            inputRef={minuteRef}
            ariaLabel={`${label} - دقیقه`}
          />
        </label>
      </div>
      <p className="mt-1 text-center text-[10px] text-gray-400">
        {toFaDigits(`${hour}:${minute}`)} {hourHint(hour)}
      </p>
    </div>
  );
}

const FESTIVAL_TYPE_OPTIONS = [
  {
    value: "free_shipping",
    title: "ارسال رایگان",
    hint: "برای شهرهای انتخابی و با حداقل مبلغ خرید",
  },
  {
    value: "discount",
    title: "تخفیف درصدی",
    hint: "درصد تخفیف روی قیمت اصلی محصولات تا زمان پایان",
  },
  {
    value: "amazing",
    title: "شگفت‌انگیز",
    hint: "ویترین محصولات؛ تخفیف پیش‌فرض یا برای هر کالا اختیاری است",
  },
];

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
  const [startTime, setStartTime] = useState(() => toTimeValue(festival?.starts_at, "00:00"));
  const [endTime, setEndTime] = useState(() => toTimeValue(festival?.ends_at, "23:59"));
  const [festivalType, setFestivalType] = useState(() => {
    if (festival?.type === "discount") return "discount";
    if (festival?.type === "amazing") return "amazing";
    return "free_shipping";
  });
  const isDiscount = festivalType === "discount";
  const isAmazing = festivalType === "amazing";
  const isFreeShipping = festivalType === "free_shipping";
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCities, setSelectedCities] = useState(() =>
    Array.isArray(festival?.city_names) ? [...festival.city_names] : []
  );
  const [selectedProducts, setSelectedProducts] = useState(() =>
    (festival?.products || []).map((product) => ({
      ...product,
      festival_discount_percent:
        product.festival_products?.discount_percent != null
          ? product.festival_products.discount_percent
          : "",
    }))
  );
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [formError, setFormError] = useState("");
  const [asnaf, setAsnaf] = useState([]);
  const [selectedSenf, setSelectedSenf] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);
  const [categoryLoaded, setCategoryLoaded] = useState(false);
  const [panelColor, setPanelColor] = useState(festival?.amazing_panel_color || "#c62828");
  const [panelImageFile, setPanelImageFile] = useState(null);
  const [removePanelImage, setRemovePanelImage] = useState(false);
  const panelImagePreview = panelImageFile
    ? URL.createObjectURL(panelImageFile)
    : !removePanelImage && festival?.amazing_panel_image
      ? `${uploadUrl}/festivals/${festival.amazing_panel_image}`
      : null;

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
      discount_percent: Number(festival?.discount_percent) || "",
      is_active: festival?.is_active !== false,
    },
  });

  const [minCartDisplay, setMinCartDisplay] = useState(() => {
    const digits = normalizeAmountDigits(String(festival?.min_cart_amount ?? ""));
    return formatAmountThousands(digits);
  });

  const cities = useMemo(() => {
    const match = IRAN_LOCATIONS.find((item) => item.province === selectedProvince);
    return match?.cities || [];
  }, [selectedProvince]);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [festival?.id]);

  useEffect(() => {
    // اعتبارسنجی حداقل سبد فقط برای جشنواره ارسال رایگان (داخل onSubmit)
    register("min_cart_amount");
  }, [register]);

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

  const addCity = (city) => {
    if (!city) return;
    setSelectedCities((prev) => (prev.includes(city) ? prev : [...prev, city]));
  };

  const removeCity = (city) => {
    setSelectedCities((prev) => prev.filter((item) => item !== city));
  };

  const isProductSelected = (productId) =>
    selectedProducts.some((item) => item.id === productId);

  const addProduct = (product) => {
    if (!product?.id || isProductSelected(product.id)) return;
    setSelectedProducts((prev) => [
      ...prev,
      { ...product, festival_discount_percent: "" },
    ]);
    setSearchValue("");
    setSearchResults([]);
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  const mergeProductsIntoSelection = (products) => {
    setSelectedProducts((prev) => {
      const ids = new Set(prev.map((item) => item.id));
      const next = [...prev];
      for (const product of products) {
        if (product?.id && !ids.has(product.id)) {
          ids.add(product.id);
          next.push({ ...product, festival_discount_percent: "" });
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
          className="h-10 w-10 rounded-lg bg-gray-50 object-contain"
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
          className="h-10 w-10 rounded-lg bg-gray-50 object-contain"
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
    const startDateTime = combineDateAndTime(startsAt, startTime);
    const endDateTime = combineDateAndTime(endsAt, endTime);
    if (endDateTime <= startDateTime) {
      setFormError("زمان پایان باید بعد از زمان شروع باشد");
      return;
    }
    const discountPercent = Number(data.discount_percent);
    if (isDiscount) {
      if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 90) {
        setFormError("درصد تخفیف باید عددی بین ۱ تا ۹۰ باشد");
        return;
      }
    } else if (isAmazing) {
      const raw = String(data.discount_percent ?? "").trim();
      if (raw) {
        if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 90) {
          setFormError("درصد پیش‌فرض باید بین ۱ تا ۹۰ باشد یا خالی بماند");
          return;
        }
      }
    } else if (isFreeShipping) {
      if (!(Number(data.min_cart_amount) >= 1)) {
        setFormError("مبلغ حداقل سبد اجباری است");
        return;
      }
      if (!selectedCities.length) {
        setFormError("حداقل یک شهر را انتخاب کنید");
        return;
      }
    }
    if (!selectedProducts.length) {
      setFormError("حداقل یک محصول انتخاب کنید");
      return;
    }

    const payload = {
      name: data.name,
      description: data.description,
      type: festivalType,
      amazing_panel_color: isAmazing ? panelColor : null,
      discount_percent: isDiscount
        ? discountPercent
        : isAmazing && String(data.discount_percent ?? "").trim()
          ? discountPercent
          : null,
      min_cart_amount: isDiscount || isAmazing ? 0 : Number(data.min_cart_amount),
      starts_at: startDateTime,
      ends_at: endDateTime,
      exact_time: true,
      is_active: Boolean(data.is_active),
      city_names: isDiscount || isAmazing ? [] : selectedCities,
      product_ids: selectedProducts.map((item) => item.id),
      product_discounts: isAmazing
        ? Object.fromEntries(
            selectedProducts.map((item) => {
              const raw = item.festival_discount_percent;
              if (raw === "" || raw === null || raw === undefined) {
                return [item.id, null];
              }
              const n = Number(raw);
              return [item.id, Number.isInteger(n) && n > 0 ? n : null];
            })
          )
        : undefined,
    };

    const requestBody = buildFestivalFormData(payload, {
      panelImageFile,
      removePanelImage,
    });

    setIsLoading(true);
    const res = isEdit
      ? await editFestival(requestBody, festival.id)
      : await createFestival(requestBody);
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
                نوع جشنواره، محصولات و بازه زمانی را مشخص کنید
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
          <div className="space-y-2">
            <label className="block text-sm font-bold">نوع جشنواره</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {FESTIVAL_TYPE_OPTIONS.map((option) => {
                const selected = festivalType === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setFestivalType(option.value)}
                    aria-pressed={selected}
                    className={`rounded-xl border px-4 py-3 text-right transition-colors ${
                      selected
                        ? "border-[#CA8549] bg-[#CA8549]/10 ring-1 ring-[#CA8549]/40"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className="block text-sm font-bold text-gray-900">{option.title}</span>
                    <span className="mt-1 block text-xs text-gray-500">{option.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

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
            {isDiscount || isAmazing ? (
              <div className="space-y-2">
                <label className="block text-sm font-bold">
                  {isAmazing ? "درصد پیش‌فرض (اختیاری)" : "درصد تخفیف"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    step={1}
                    inputMode="numeric"
                    dir="ltr"
                    className="admin-input pl-9 text-left"
                    placeholder={isAmazing ? "خالی = بدون تخفیف کلی" : "مثلاً 30"}
                    {...register("discount_percent")}
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    ٪
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {isAmazing
                    ? "برای هر محصول می‌توانید جداگانه درصد بگذارید یا خالی بگذارید تا فقط ویترین باشد."
                    : "روی قیمت اصلی محصول حساب می‌شود؛ اگر محصول از قبل تخفیف بیشتری داشته باشد، همان قیمت ارزان‌تر می‌ماند."}
                </p>
              </div>
            ) : (
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
              </div>
            )}
          </div>

          {isAmazing ? (
            <div className="space-y-3 rounded-xl border border-fuchsia-200/80 bg-fuchsia-50/40 p-4">
              <h3 className="text-sm font-bold text-gray-800">ظاهر پنل در سایت</h3>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">رنگ پس‌زمینه</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={panelColor}
                      onChange={(e) => setPanelColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded border border-gray-200"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={panelColor}
                      onChange={(e) => setPanelColor(e.target.value)}
                      className="admin-input w-28 text-left text-xs"
                      placeholder="#c62828"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <label className="text-xs text-gray-600">
                    تصویر بالای نام جشنواره (جایگزین علامت ٪)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="block w-full text-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setPanelImageFile(file || null);
                      setRemovePanelImage(false);
                    }}
                  />
                </div>
              </div>
              {panelImagePreview ? (
                <div className="flex items-start gap-3">
                  <img
                    src={panelImagePreview}
                    alt=""
                    className="h-20 w-20 rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => {
                      setPanelImageFile(null);
                      setRemovePanelImage(true);
                    }}
                  >
                    حذف تصویر
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

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
              <label className="block text-sm font-bold">تاریخ و ساعت شروع</label>
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1 pt-[18px]">
                  <PersianDateField
                    value={startsAt}
                    onChange={setStartsAt}
                    placeholder="انتخاب تاریخ شروع"
                  />
                </div>
                <TimeField value={startTime} onChange={setStartTime} label="ساعت شروع" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold">تاریخ و ساعت پایان</label>
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1 pt-[18px]">
                  <PersianDateField
                    value={endsAt}
                    onChange={setEndsAt}
                    placeholder="انتخاب تاریخ پایان"
                  />
                </div>
                <TimeField value={endTime} onChange={setEndTime} label="ساعت پایان" />
              </div>
            </div>
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" {...register("is_active")} />
              جشنواره فعال باشد
            </label>
          )}

          {isFreeShipping && (
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
          )}

          <div className="rounded-xl border border-gray-100 p-4">
            <h3 className="mb-3 text-sm font-bold">محصولات جشنواره</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-dashed border-gray-200 p-3">
                <p className="text-xs font-bold text-gray-600">انتخاب از دسته‌بندی</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    className="admin-input"
                    value={selectedSenf}
                    onChange={(e) => setSelectedSenf(e.target.value)}
                  >
                    <option value="">دسته اصلی</option>
                    {asnaf.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="admin-input"
                    value={selectedSubcategory}
                    disabled={!selectedSenf}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                  >
                    <option value="">زیردسته (اختیاری)</option>
                    {subcategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="admin-btn-secondary w-full !py-2 text-sm"
                  disabled={!selectedSenf || loadingCategoryProducts}
                  onClick={loadCategoryProducts}
                >
                  {loadingCategoryProducts ? "در حال بارگذاری..." : "نمایش و انتخاب محصولات دسته"}
                </button>
                {categoryLoaded && categoryProducts.length > 0 && (
                  <div className="max-h-56 overflow-auto rounded-xl border border-gray-100">
                    {categoryProducts.map((product) => renderCategoryProductRow(product))}
                  </div>
                )}
                {categoryLoaded && !categoryProducts.length && (
                  <p className="text-xs text-gray-400">محصولی در این دسته یافت نشد</p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-600">جستجو یا محصولات انتخاب‌شده</p>
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
                    className="admin-input pr-10"
                  />
                </div>
                {(searching || searchResults.length > 0) && (
                  <div className="max-h-40 overflow-auto rounded-xl border border-gray-100">
                    {searching && (
                      <p className="px-3 py-2 text-xs text-gray-400">در حال جستجو...</p>
                    )}
                    {searchResults.map((product) => renderProductPickButton(product))}
                  </div>
                )}
                <div className="max-h-56 space-y-2 overflow-auto rounded-xl border border-gray-100 p-2">
                  {selectedProducts.length ? (
                    selectedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col gap-2 rounded-xl border border-gray-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={`${uploadUrl}/products/${product.images_path?.[0] || ""}`}
                            alt=""
                            className="h-10 w-10 rounded-lg bg-gray-50 object-contain"
                          />
                          <span className="truncate text-sm font-medium">{product.name}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                          {isAmazing ? (
                            <label className="flex items-center gap-1 text-[11px] text-gray-500">
                              <span>تخفیف</span>
                              <input
                                type="number"
                                min={1}
                                max={90}
                                dir="ltr"
                                className="w-14 rounded-lg border border-gray-200 px-2 py-1 text-center text-xs"
                                placeholder="—"
                                value={product.festival_discount_percent ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSelectedProducts((prev) =>
                                    prev.map((item) =>
                                      item.id === product.id
                                        ? { ...item, festival_discount_percent: value }
                                        : item
                                    )
                                  );
                                }}
                              />
                              <span>٪</span>
                            </label>
                          ) : null}
                          <button
                            type="button"
                            className="text-xs text-red-500"
                            onClick={() => removeProduct(product.id)}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="px-2 py-3 text-xs text-gray-400">هنوز محصولی انتخاب نشده است</p>
                  )}
                </div>
              </div>
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
