"use client";

import React, { useRef, useState } from "react";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import importNewsletterExcel from "@/funcs/importNewsletterExcel";
import getNewsletterImportTemplate from "@/funcs/getNewsletterImportTemplate";
import Loader from "@/components/modules/Loader";

function NewsletterImportPanel({ onImported }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const downloadTemplate = () => {
    setIsDownloadingTemplate(true);
    getNewsletterImportTemplate().finally(() => setIsDownloadingTemplate(false));
  };

  const importHandler = () => {
    if (!selectedFile) return;

    setIsImporting(true);
    importNewsletterExcel(selectedFile)
      .then((res) => {
        if (res?.status) {
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          onImported?.();
        }
      })
      .finally(() => setIsImporting(false));
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 space-y-3">
      {(isImporting || isDownloadingTemplate) && <Loader />}

      <p className="text-xs font-bold text-gray-600">ورود از اکسل</p>

      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <label htmlFor="newsletter-import-file" className="block text-xs text-gray-500">
            انتخاب فایل
          </label>
          <input
            ref={fileInputRef}
            id="newsletter-import-file"
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="admin-input w-full file:mr-2 file:rounded-md file:border-0 file:bg-brand-navy/10 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-brand-navy"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          {selectedFile ? (
            <p className="text-[11px] text-gray-500 truncate">{selectedFile.name}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button type="button" className="admin-btn-secondary !py-2 !px-3 text-sm" onClick={downloadTemplate}>
            <DownloadOutlinedIcon sx={{ fontSize: 16 }} />
            نمونه
          </button>
          <button
            type="button"
            className="admin-btn-success !py-2 !px-3 text-sm"
            disabled={!selectedFile || isImporting}
            onClick={importHandler}
          >
            <UploadFileOutlinedIcon sx={{ fontSize: 16 }} />
            import
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsletterImportPanel;
