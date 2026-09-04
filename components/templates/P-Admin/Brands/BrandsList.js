"use client";

import React, { useState } from "react";
import BrandsTable from "./BrandsTable";
import EditBrandModal from "./EditBrandModal";
import getBrands from "@/funcs/getBrands";
import deleteBrand from "@/funcs/deleteBrand";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";
import Loader from "@/components/modules/Loader";

function BrandsList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = () => {
    getBrands(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res) setShownData(res);
    });
  };

  const deleteHandler = (id) => {
    setIsLoading(true);
    deleteBrand(id).then(() => {
      setIsLoading(false);
      refresh();
    });
  };

  return (
    <div className="my-6 space-y-4">
      {isLoading && <Loader />}

      {editingItem && (
        <EditBrandModal
          setIsModalShow={(show) => {
            if (!show) setEditingItem(null);
          }}
          itemData={editingItem}
        />
      )}

      {!shownData?.body?.length ? (
        <EmptyMessage text="هنوز برندی ثبت نشده است." />
      ) : (
        <>
          <p className="text-xs text-gray-500">{shownData.body.length} برند</p>
          <BrandsTable
            items={shownData.body}
            onEdit={setEditingItem}
            onDelete={deleteHandler}
          />
        </>
      )}
    </div>
  );
}

export default BrandsList;
