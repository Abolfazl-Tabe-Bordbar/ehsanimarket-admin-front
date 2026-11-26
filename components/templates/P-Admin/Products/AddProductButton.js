"use client";
import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import ExelOutputModal from "./ExelOutputModal";

function AddProductButton({ excelImportOpen = false, onToggleExcelImport }) {
  const [isAddProductModalShow, setIsAddProductModalShow] = useState(false);
  const [isExelOutputModalShow, setIsExelOutputModalShow] = useState(false);

  return (
    <>
      {isAddProductModalShow && (
        <AddProductModal setIsAddProductModalShow={setIsAddProductModalShow} />
      )}
      {isExelOutputModalShow && (
        <ExelOutputModal setIsExelOutputModalShow={setIsExelOutputModalShow} />
      )}
      <div className="flex flex-wrap gap-2">
        <button
          className="admin-btn-primary"
          onClick={() => setIsAddProductModalShow(true)}
        >
          ایجاد محصول جدید
        </button>
        <button
          className="admin-btn-success"
          onClick={() => setIsExelOutputModalShow(true)}
        >
          دریافت خروجی اکسل
        </button>
        {onToggleExcelImport ? (
          <button
            type="button"
            className={
              excelImportOpen
                ? "admin-btn-secondary ring-2 ring-[#CA8549]/40"
                : "admin-btn-secondary"
            }
            onClick={onToggleExcelImport}
            aria-expanded={excelImportOpen}
          >
            {excelImportOpen ? "بستن ورود اکسل" : "ورود اکسل قیمت و موجودی"}
          </button>
        ) : null}
      </div>
    </>
  );
}

export default AddProductButton;
