"use client";
import React, { useEffect, useState } from "react";
import ReasonBox from "./ReasonBox";
import getRejectionReasons from "@/funcs/getRejectionReasons";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";

function ReasonList({ data, refreshKey = 0 }) {
  const [shownData, setShownData] = useState(data);

  const getReasonsHandler = () => {
    getRejectionReasons(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    if (refreshKey > 0) {
      getReasonsHandler();
    }
  }, [refreshKey]);

  return (
    <div className="my-6">
      {!shownData?.body?.length ? (
        <EmptyMessage text="هنوز دلیلی برای رد خرید ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {shownData.body.map((reason) => (
            <ReasonBox
              key={reason.id}
              {...reason}
              getReasonsHandler={getReasonsHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReasonList;
