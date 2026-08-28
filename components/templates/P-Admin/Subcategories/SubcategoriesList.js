"use client";
import React, { useEffect, useState } from "react";
import EmptyMessage from "@/components/modules/EmptyMessage";
import getAsnaf from "@/funcs/getAsnaf";
import getCookie from "@/funcs/cookies/getCookie";
import SubcategoryBox from "./SubcategoryBox";
import getSubcategories from "@/funcs/getSubcategories";

function SubcategoriesList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [issubcategoriesEmpty, setIssubcategoriesEmpty] = useState(false);

  const getSubcategoriesHandler = () => {
    getSubcategories(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    setIssubcategoriesEmpty(
      shownData?.body?.every((senf) => senf.subcategories?.length === 0)
    );
  }, [shownData]);

  return (
    <div className="mt-6">
      <div className="admin-list">
        {!issubcategoriesEmpty ? (
          shownData.body?.map((senf) =>
            senf.subcategories?.length
              ? senf.subcategories.map((subcat) => (
                  <SubcategoryBox
                    key={subcat.id}
                    getSubcategoriesHandler={getSubcategoriesHandler}
                    {...subcat}
                    parent={senf.name}
                  />
                ))
              : ""
          )
        ) : (
          <EmptyMessage text="هیچ زیردسته ای ثبت نشده است." />
        )}
      </div>
    </div>
  );
}

export default SubcategoriesList;
