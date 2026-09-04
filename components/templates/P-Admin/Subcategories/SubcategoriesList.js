"use client";
import React, { useMemo, useState } from "react";
import EmptyMessage from "@/components/modules/EmptyMessage";
import getCookie from "@/funcs/cookies/getCookie";
import SubcategoryBox from "./SubcategoryBox";
import getSubcategories from "@/funcs/getSubcategories";

function SubcategoriesList({ data }) {
  const [shownData, setShownData] = useState(data);

  const getSubcategoriesHandler = () => {
    getSubcategories(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  const subcategories = useMemo(() => {
    const items = [];
    for (const senf of shownData?.body || []) {
      for (const subcat of senf.subcategories || []) {
        items.push({ ...subcat, parent: senf.name });
      }
    }
    return items;
  }, [shownData]);

  const parentCount = useMemo(() => {
    return new Set(subcategories.map((item) => item.parent).filter(Boolean))
      .size;
  }, [subcategories]);

  return (
    <div className="my-2">
      {subcategories.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">تعداد زیردسته‌ها</span>
            <span className="text-lg font-bold text-[#141c32]">
              {subcategories.length}
            </span>
          </div>
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">دسته‌های والد</span>
            <span className="text-lg font-bold text-[#CA8549]">
              {parentCount}
            </span>
          </div>
        </div>
      )}

      {!subcategories.length ? (
        <EmptyMessage text="هیچ زیردسته‌ای ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {subcategories.map((subcat) => (
            <SubcategoryBox
              key={subcat.id}
              getSubcategoriesHandler={getSubcategoriesHandler}
              {...subcat}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SubcategoriesList;
