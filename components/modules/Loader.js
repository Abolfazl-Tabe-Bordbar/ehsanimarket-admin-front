import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-navy/50 backdrop-blur-[2px] overscroll-none">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-2xl">
        <CircularProgress sx={{ color: "#CA8549" }} size={44} />
        <p className="text-sm text-gray-500">لطفاً صبر کنید…</p>
      </div>
    </div>
  );
}

export default Loader;
