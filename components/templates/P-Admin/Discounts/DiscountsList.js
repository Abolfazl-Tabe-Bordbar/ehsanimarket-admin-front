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

  return (
    <div className="my-6">
      {!shownData?.body?.length ? (
        <EmptyMessage text="هیچ پلن تخفیفی ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {shownData?.body?.map((discount) => (
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
