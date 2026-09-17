"use client";

import React, { useRef, useState } from "react";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import getUsersImportTemplate from "@/funcs/getUsersImportTemplate";
import previewUsersImport from "@/funcs/previewUsersImport";
import confirmUsersImport from "@/funcs/confirmUsersImport";

const STATUS_LABELS = {
  valid: { text: "آماده ثبت", className: "text-emerald-700 bg-emerald-50" },
  invalid: { text: "نامعتبر", className: "text-red-700 bg-red-50" },
  exists: { text: "قبلاً ثبت شده", className: "text-amber-700 bg-amber-50" },
  duplicate: { text: "تکراری در فایل", className: "text-orange-700 bg-orange-50" },
};

const ACCEPTED_TYPES = [
  ".xlsx",
  ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes.toLocaleString("fa-IR")} بایت`;
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024).toLocaleString("fa-IR")} کیلوبایت`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1).toLocaleString("fa-IR")} مگابایت`;
}

function isExcelFile(file) {
  if (!file) return false;
  const name = file.name?.toLowerCase() || "";
  return name.endsWith(".xlsx") || name.endsWith(".xls");
}

function UsersImportPanel({ onImported }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resetPreview = () => setPreviewData(null);

  const clearFile = () => {
    setSelectedFile(null);
    resetPreview();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectFile = (file) => {
    if (!isExcelFile(file)) return;
    setSelectedFile(file);
    resetPreview();
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0] || null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0] || null);
  };

  const downloadTemplate = () => {
    setIsLoading(true);
    getUsersImportTemplate().finally(() => setIsLoading(false));
  };

  const previewHandler = () => {
    if (!selectedFile) return;

    setIsLoading(true);
    previewUsersImport(selectedFile)
      .then((res) => {
        if (res?.status) {
          setPreviewData(res.body);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const confirmHandler = () => {
    if (!previewData?.rows?.length) return;

    const validRows = previewData.rows.filter((row) => row.status === "valid");
    if (!validRows.length) return;

    setIsLoading(true);
    confirmUsersImport(validRows)
      .then((res) => {
        if (res?.status) {
          clearFile();
          onImported?.();
        }
      })
      .finally(() => setIsLoading(false));
  };

  const validCount = previewData?.summary?.valid || 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/80 p-4 sm:p-5 space-y-4 shadow-sm">
      {isLoading && <Loader />}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800">ورود کاربران از اکسل</p>
          <p className="mt-1 text-xs leading-6 text-gray-500">
            فایل را بارگذاری کنید، پیش‌نمایش بگیرید و سپس ثبت را تأیید کنید.
            ستون «تگ کاربر» اختیاری است؛ نام تگ‌های از قبل تعریف‌شده را بنویسید و برای
            چند تگ، آن‌ها را با کاما جدا کنید (مثال: VIP، عمده‌فروش).
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-secondary !py-2 !px-3 text-sm shrink-0 self-start"
          onClick={downloadTemplate}
        >
          <DownloadOutlinedIcon sx={{ fontSize: 16 }} />
          دانلود فایل نمونه
        </button>
      </div>

      <input
        ref={fileInputRef}
        id="users-import-file"
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />

      {!selectedFile ? (
        <label
          htmlFor="users-import-file"
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
          className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-all ${
            isDragging
              ? "border-brand-gold bg-brand-gold/5 scale-[1.01]"
              : "border-gray-200 bg-white hover:border-brand-navy/30 hover:bg-brand-navy/[0.02]"
          }`}
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
              isDragging
                ? "bg-brand-gold/15 text-brand-gold"
                : "bg-brand-navy/8 text-brand-navy group-hover:bg-brand-navy/12"
            }`}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 30 }} />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-800">
              {isDragging ? "فایل را رها کنید" : "فایل اکسل را اینجا بکشید یا انتخاب کنید"}
            </p>
            <p className="text-xs text-gray-500">فرمت‌های مجاز: xlsx, xls</p>
          </div>
          <span className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-medium text-white shadow-sm shadow-brand-navy/20 transition-transform group-hover:scale-[1.02]">
            انتخاب فایل
          </span>
        </label>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <DescriptionOutlinedIcon sx={{ fontSize: 26 }} />
              </span>
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-semibold text-gray-800">{selectedFile.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                className="admin-btn-secondary !py-2 !px-3 text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                تغییر فایل
              </button>
              <button
                type="button"
                className="admin-btn-ghost !py-2 !px-2 text-sm text-red-600 hover:bg-red-50"
                onClick={clearFile}
                aria-label="حذف فایل"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
              <button
                type="button"
                className="admin-btn-primary !py-2 !px-3 text-sm"
                disabled={isLoading}
                onClick={previewHandler}
              >
                <PreviewOutlinedIcon sx={{ fontSize: 16 }} />
                پیش‌نمایش
              </button>
            </div>
          </div>
        </div>
      )}

      {previewData && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "کل", value: previewData.summary.total, className: "bg-gray-100 text-gray-700" },
              { label: "آماده", value: previewData.summary.valid, className: "bg-emerald-50 text-emerald-700" },
              { label: "نامعتبر", value: previewData.summary.invalid, className: "bg-red-50 text-red-700" },
              { label: "موجود", value: previewData.summary.exists, className: "bg-amber-50 text-amber-700" },
              { label: "تکراری", value: previewData.summary.duplicate, className: "bg-orange-50 text-orange-700" },
            ].map((item) => (
              <span
                key={item.label}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${item.className}`}
              >
                {item.label}
                <span className="font-bold">{item.value.toLocaleString("fa-IR")}</span>
              </span>
            ))}
          </div>

          <div className="admin-table-wrap max-h-80 overflow-y-auto">
            <table className="admin-table text-xs">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>نام</th>
                  <th>نام خانوادگی</th>
                  <th>شماره</th>
                  <th>نام کاربری</th>
                  <th>استان</th>
                  <th>شهر</th>
                  <th>تگ کاربر</th>
                  <th>وضعیت</th>
                  <th>توضیح</th>
                </tr>
              </thead>
              <tbody>
                {previewData.rows.map((row) => {
                  const statusInfo = STATUS_LABELS[row.status] || STATUS_LABELS.invalid;
                  return (
                    <tr key={row.rowNumber}>
                      <td>{row.rowNumber}</td>
                      <td>{row.first_name || "—"}</td>
                      <td>{row.last_name || "—"}</td>
                      <td className="dir-ltr text-left">{row.phone_number || "—"}</td>
                      <td className="dir-ltr text-left">{row.username || "—"}</td>
                      <td>{row.province || "—"}</td>
                      <td>{row.city || "—"}</td>
                      <td>{row.user_tags || row.tag_names?.join("، ") || "—"}</td>
                      <td>
                        <span className={`rounded-full px-2 py-0.5 ${statusInfo.className}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td>{row.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="admin-btn-secondary" onClick={resetPreview}>
              انصراف
            </button>
            <button
              type="button"
              className="admin-btn-success"
              disabled={!validCount || isLoading}
              onClick={confirmHandler}
            >
              <UploadFileOutlinedIcon sx={{ fontSize: 16 }} />
              تأیید و ثبت {validCount ? `(${validCount} کاربر)` : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersImportPanel;
