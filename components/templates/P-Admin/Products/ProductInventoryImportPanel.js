"use client";

import React, { useRef, useState } from "react";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import importProductsInventoryExcel from "@/funcs/importProductsInventoryExcel";
import getProductsInventoryImportTemplate from "@/funcs/getProductsInventoryImportTemplate";
import previewProductsInventoryExcel from "@/funcs/previewProductsInventoryExcel";
import Loader from "@/components/modules/Loader";
import { TopRightToast } from "@/components/modules/Toast";

function ProductInventoryImportPanel({ onImported }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const resetFileState = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    setIsDownloadingTemplate(true);
    getProductsInventoryImportTemplate().finally(() => setIsDownloadingTemplate(false));
  };

  const handleFileChange = async (file) => {
    setSelectedFile(file || null);
    setPreview(null);

    if (!file) return;

    setIsPreviewing(true);
    try {
      const res = await previewProductsInventoryExcel(file);
      if (res?.status) {
        setPreview(res.summary);
      } else {
        TopRightToast.fire({
          icon: "error",
          title: res?.message || "خطا در خواندن فایل",
        });
      }
    } catch {
      TopRightToast.fire({
        icon: "error",
        title: "خطا در بررسی فایل. API را restart کنید.",
      });
    } finally {
      setIsPreviewing(false);
    }
  };

  const importHandler = () => {
    if (!selectedFile) return;

    setIsImporting(true);
    importProductsInventoryExcel(selectedFile)
      .then((res) => {
        if (res?.status) {
          resetFileState();
          onImported?.();
        }
      })
      .finally(() => setIsImporting(false));
  };

  const identified = preview?.identified ?? 0;
  const matched = preview?.matchedInShop ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#CA8549]/30 bg-white shadow-sm">
      {(isImporting || isPreviewing || isDownloadingTemplate) && <Loader />}

      <div className="border-b border-gray-100 bg-gradient-to-l from-[#253c8a]/8 via-white to-[#CA8549]/10 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#253c8a]/10 text-[#253c8a]">
            <TableChartOutlinedIcon />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-brand-navy md:text-base">
              بروزرسانی قیمت و موجودی از اکسل
            </h3>
            <p className="mt-1 text-xs leading-6 text-gray-600">
              ستون‌ها: <span className="font-semibold text-gray-700">کد کالا</span>،{" "}
              <span className="font-semibold text-gray-700">قیمت</span>،{" "}
              <span className="font-semibold text-gray-700">موجودی</span> — حداقل یکی از
              قیمت یا موجودی را پر کنید.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-secondary !py-2 !px-3 text-sm inline-flex items-center gap-1 shrink-0"
            onClick={downloadTemplate}
          >
            <DownloadOutlinedIcon sx={{ fontSize: 16 }} />
            دانلود نمونه
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4 md:p-6">
        <label
          htmlFor="products-inventory-import-file"
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
            selectedFile
              ? "border-emerald-300 bg-emerald-50/40"
              : "border-gray-200 bg-gray-50/60 hover:border-[#CA8549]/50 hover:bg-[#CA8549]/5"
          }`}
        >
          <UploadFileOutlinedIcon
            sx={{ fontSize: 36 }}
            className={selectedFile ? "text-emerald-600" : "text-gray-400 group-hover:text-[#CA8549]"}
          />
          <p className="mt-2 text-sm font-bold text-gray-700">
            {selectedFile ? selectedFile.name : "فایل اکسل را انتخاب کنید"}
          </p>
          <p className="mt-1 text-xs text-gray-500">فرمت‌های مجاز: .xlsx , .xls</p>
          <input
            ref={fileInputRef}
            id="products-inventory-import-file"
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="sr-only"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </label>

        {preview ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-3">
              <p className="text-[11px] font-bold text-emerald-800">محصول شناسایی‌شده</p>
              <p className="mt-1 text-lg font-bold text-emerald-900">
                {identified.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-xl border border-[#253c8a]/15 bg-[#253c8a]/5 px-3 py-3">
              <p className="text-[11px] font-bold text-[#253c8a]">قابل به‌روزرسانی در فروشگاه</p>
              <p className="mt-1 text-lg font-bold text-brand-navy">
                {matched.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-3">
              <p className="text-[11px] font-bold text-amber-800">ردیف نامعتبر / تکراری</p>
              <p className="mt-1 text-lg font-bold text-amber-900">
                {(preview.invalid + preview.skipped).toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        ) : null}

        {preview && preview.notFound > 0 ? (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-900">
            <ErrorOutlineIcon sx={{ fontSize: 16 }} className="mt-0.5 shrink-0" />
            <span>
              {preview.notFound.toLocaleString("fa-IR")} کد کالا در سیستم پیدا نشد و هنگام
              اعمال تغییرات نادیده گرفته می‌شود.
            </span>
          </div>
        ) : null}

        {preview && identified > 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-xs text-emerald-900">
            <CheckCircleOutlineIcon sx={{ fontSize: 16 }} className="shrink-0" />
            <span>
              {identified.toLocaleString("fa-IR")} محصول از فایل شناسایی شد
              {matched > 0
                ? `؛ ${matched.toLocaleString("fa-IR")} مورد برای به‌روزرسانی آماده است.`
                : "."}
            </span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
          {selectedFile ? (
            <button
              type="button"
              className="admin-btn-secondary !py-2 !px-4 text-sm"
              onClick={resetFileState}
              disabled={isImporting || isPreviewing}
            >
              پاک کردن فایل
            </button>
          ) : null}
          <button
            type="button"
            className="admin-btn-success !py-2 !px-4 text-sm inline-flex items-center gap-1"
            disabled={!selectedFile || isImporting || isPreviewing || !preview?.matchedInShop}
            onClick={importHandler}
          >
            <UploadFileOutlinedIcon sx={{ fontSize: 16 }} />
            اعمال تغییرات
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductInventoryImportPanel;
