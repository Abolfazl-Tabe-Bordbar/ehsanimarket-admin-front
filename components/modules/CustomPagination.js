"use client";

import Link from "next/link";
import React from "react";

const CustomPagination = ({ currentPage, totalPages, status = "none", extraQuery = "" }) => {
  const statusQuery =
    status && status !== "none"
      ? `&status=${status}`
      : "";
  const suffix = `${statusQuery}${extraQuery}`;

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 4;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  };

  return (
    <nav
      className="flex justify-center items-center gap-1 sm:gap-2 mt-10 md:mt-12"
      aria-label="صفحه‌بندی"
    >
      <Link
        href={currentPage > 1 ? `?p=${currentPage - 1}${suffix}` : ""}
        onClick={(e) => currentPage <= 1 && e.preventDefault()}
        className={`admin-btn-secondary !py-2 !px-3 text-xs sm:text-sm ${
          currentPage <= 1 ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        صفحه قبل
      </Link>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {generatePageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-1 text-gray-400 select-none">
              …
            </span>
          ) : (
            <Link
              href={`?p=${page}${suffix}`}
              key={index}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-xs sm:text-sm font-medium transition-colors select-none ${
                currentPage === page
                  ? "bg-brand-gold text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page.toLocaleString("fa")}
            </Link>
          )
        )}
      </div>

      <Link
        href={
          currentPage < totalPages ? `?p=${currentPage + 1}${suffix}` : ""
        }
        onClick={(e) => currentPage >= totalPages && e.preventDefault()}
        className={`admin-btn-secondary !py-2 !px-3 text-xs sm:text-sm ${
          currentPage >= totalPages ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        صفحه بعد
      </Link>
    </nav>
  );
};

export default CustomPagination;
