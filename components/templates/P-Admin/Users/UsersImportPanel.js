"use client";

import React, { useRef, useState } from "react";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
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

function UsersImportPanel({ onImported }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetPreview = () => setPreviewData(null);

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
          setSelectedFile(null);
          setPreviewData(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          onImported?.();
        }
      })
      .finally(() => setIsLoading(false));
  };

  const validCount = previewData?.summary?.valid || 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 space-y-4">
      {isLoading && <Loader />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs font-bold text-gray-600">ورود کاربران از اکسل</p>
        <p className="text-[11px] text-gray-500">
          فایل را بارگذاری کنید، پیش‌نمایش بگیرید و سپس ثبت را تأیید کنید
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <label htmlFor="users-import-file" className="block text-xs text-gray-500">
            انتخاب فایل اکسل
          </label>
          <input
            ref={fileInputRef}
            id="users-import-file"
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="admin-input w-full file:mr-2 file:rounded-md file:border-0 file:bg-brand-navy/10 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-brand-navy"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] || null);
              resetPreview();
            }}
          />
          {selectedFile ? (
            <p className="text-[11px] text-gray-500 truncate">{selectedFile.name}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button type="button" className="admin-btn-secondary !py-2 !px-3 text-sm" onClick={downloadTemplate}>
            <DownloadOutlinedIcon sx={{ fontSize: 16 }} />
            فایل نمونه
          </button>
          <button
            type="button"
            className="admin-btn-primary !py-2 !px-3 text-sm"
            disabled={!selectedFile || isLoading}
            onClick={previewHandler}
          >
            <PreviewOutlinedIcon sx={{ fontSize: 16 }} />
            پیش‌نمایش
          </button>
        </div>
      </div>

      {previewData && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 text-xs">
            <span>کل: {previewData.summary.total}</span>
            <span className="text-emerald-700">آماده: {previewData.summary.valid}</span>
            <span className="text-red-700">نامعتبر: {previewData.summary.invalid}</span>
            <span className="text-amber-700">موجود: {previewData.summary.exists}</span>
            <span className="text-orange-700">تکراری: {previewData.summary.duplicate}</span>
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
