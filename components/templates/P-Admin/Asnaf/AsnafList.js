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

  return (
    <div className="mt-6">
      {!shownData.status ? (
        <EmptyMessage text="هیچ دسته بندی ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {shownData.body?.map((senf) => (
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
