"use client";
import React, { useState } from "react";
import FaqBox from "./FaqBox";
import getFaqs from "@/funcs/getFaqs";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";

function FaqList({ data }) {
  const [shownData, setShownData] = useState(data);

  const getFaqsHandler = () => {
    getFaqs(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  return (
    <div className="my-6">
      {!shownData?.body?.length ? (
        <EmptyMessage text="هیچ سوال متداولی ثبت نشده است." />
      ) : (
        <>
          <div className="admin-list">
            {shownData?.body?.map((faq) => (
              <FaqBox key={faq.id} {...faq} getFaqsHandler={getFaqsHandler} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FaqList;
