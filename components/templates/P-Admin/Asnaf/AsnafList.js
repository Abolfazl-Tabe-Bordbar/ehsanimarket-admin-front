"use client";
import React, { useState } from "react";
import SenfBox from "./SenfBox";
import EmptyMessage from "@/components/modules/EmptyMessage";
import getAsnaf from "@/funcs/getAsnaf";
import getCookie from "@/funcs/cookies/getCookie";

function AsnafList({ data }) {
  const [shownData, setShownData] = useState(data);

  const getAsnafHandler = () => {
    getAsnaf(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  const categories = shownData?.body || [];

  return (
    <div className="my-2">
      {categories.length > 0 && (
        <div className="mb-4">
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">تعداد دسته‌بندی‌های اصلی</span>
            <span className="text-lg font-bold text-[#141c32]">
              {categories.length}
            </span>
          </div>
        </div>
      )}

      {!categories.length ? (
        <EmptyMessage text="هیچ دسته‌بندی ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {categories.map((senf) => (
            <SenfBox
              key={senf.id}
              getAsnafHandler={getAsnafHandler}
              {...senf}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AsnafList;
