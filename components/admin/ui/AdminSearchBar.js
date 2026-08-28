"use client";

import React from "react";

function AdminSearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "جستجو...",
  showClear = true,
  className = "",
}) {
  const isSearching = Boolean(value?.trim());

  return (
    <div className={className}>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          className="admin-input rounded-r-3xl !rounded-l-xl flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch(value);
          }}
        />
        <button
          type="button"
          className="admin-btn-accent rounded-l-3xl !rounded-r-xl shrink-0"
          onClick={() => onSearch(value)}
        >
          جستجو
        </button>
      </div>
      {showClear && isSearching && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-brand-gold mt-2"
        >
          پاک کردن جستجو
        </button>
      )}
    </div>
  );
}

export default AdminSearchBar;
