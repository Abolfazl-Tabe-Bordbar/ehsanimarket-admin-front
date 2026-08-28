"use client";

import React, { useState } from "react";
import TestimonialsTable from "./TestimonialsTable";
import EditTestimonialModal from "./EditTestimonialModal";
import getTestimonials from "@/funcs/getTestimonials";
import deleteTestimonial from "@/funcs/deleteTestimonial";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";
import Loader from "@/components/modules/Loader";

function TestimonialsList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTestimonialsHandler = () => {
    getTestimonials(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res) setShownData(res);
    });
  };

  const deleteHandler = (id) => {
    setIsLoading(true);
    deleteTestimonial(id).then(() => {
      setIsLoading(false);
      getTestimonialsHandler();
    });
  };

  return (
    <div className="my-6 space-y-4">
      {isLoading && <Loader />}

      {editingItem && (
        <EditTestimonialModal
          setIsModalShow={(show) => {
            if (!show) setEditingItem(null);
          }}
          itemData={editingItem}
        />
      )}

      {!shownData?.body?.length ? (
        <EmptyMessage text="هنوز نظری ثبت نشده است." />
      ) : (
        <>
          <p className="text-xs text-gray-500">{shownData.body.length} نظر</p>
          <TestimonialsTable
            items={shownData.body}
            onEdit={setEditingItem}
            onDelete={deleteHandler}
          />
        </>
      )}
    </div>
  );
}

export default TestimonialsList;
