"use client";

import React from "react";
import { createPortal } from "react-dom";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-brand-navy/70 backdrop-blur-sm overscroll-none"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-2xl">
        <CircularProgress sx={{ color: "#CA8549" }} size={44} />
        <p className="text-sm text-gray-500">لطفاً صبر کنید…</p>
      </div>
    </div>,
    document.body
  );
}

export default Loader;
