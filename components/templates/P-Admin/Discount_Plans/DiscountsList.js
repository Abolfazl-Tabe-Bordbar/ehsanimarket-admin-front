"use client";
import React, { useEffect, useState } from "react";
import DiscountBox from "./DiscountBox";
import EmptyMessage from "@/components/modules/EmptyMessage";
import getDiscountPlans from "@/funcs/getDiscountPlans";
import getCookie from "@/funcs/cookies/getCookie";

function DiscountsList({ data }) {
  const [shownData, setShownData] = useState(data);
  
  const getDiscountPlansHandler = () => {
    getDiscountPlans(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    setShownData(data);
  }, [data]);

  const plans = shownData?.body || [];

  return (
    <div className="my-2">
      {plans.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">تعداد پلن‌ها</span>
            <span className="text-lg font-bold text-[#141c32]">{plans.length}</span>
          </div>
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">پلن‌های فعال</span>
            <span className="text-lg font-bold text-emerald-700">
              {plans.filter((p) => p.is_active).length}
            </span>
          </div>
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">میانگین تخفیف</span>
            <span className="text-lg font-bold text-[#CA8549]">
              {Math.round(
                plans.reduce((sum, p) => sum + Number(p.percentage || 0), 0) /
                  plans.length
              )}
              %
            </span>
          </div>
        </div>
      )}

      {!plans.length ? (
        <EmptyMessage text="هیچ پلن تخفیفی ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {plans.map((discount) => (
            <DiscountBox
              key={discount.id}
              {...discount}
              getDiscountPlansHandler={getDiscountPlansHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscountsList;
