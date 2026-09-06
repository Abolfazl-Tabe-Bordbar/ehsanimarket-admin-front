"use client";

import React, { useState } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { TopRightToast } from "@/components/modules/Toast";

function CopyButton({ value, label = "کپی شد", className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      TopRightToast.fire({
        icon: "success",
        title: label,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      TopRightToast.fire({
        icon: "error",
        title: "کپی انجام نشد",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-brand-navy transition-colors hover:bg-gray-50 ${className}`.trim()}
      aria-label="کپی"
    >
      {copied ? (
        <CheckOutlinedIcon sx={{ fontSize: 13 }} className="text-emerald-600" />
      ) : (
        <ContentCopyOutlinedIcon sx={{ fontSize: 13 }} />
      )}
      کپی
    </button>
  );
}

export default CopyButton;
