"use client";

import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import Loader from "@/components/modules/Loader";
import deleteNewsletterSubscriber from "@/funcs/deleteNewsletterSubscriber";
import toggleNewsletterSubscriber from "@/funcs/toggleNewsletterSubscriber";

function SubscriberBox({ subscriber, onChange }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleNewsletterSubscriber(subscriber.id);
    setLoading(false);
    onChange();
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteNewsletterSubscriber(subscriber.id);
    setLoading(false);
    onChange();
  };

  const createdAt = subscriber.createdAt
    ? new Date(subscriber.createdAt).toLocaleDateString("fa-IR")
    : "—";

  return (
    <div className="admin-card relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {loading && <Loader />}
      <div className="flex flex-col gap-2 min-w-0 flex-1 pt-8 lg:pt-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-brand-navy dir-ltr">{subscriber.phone}</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full ${
              subscriber.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {subscriber.is_active ? "فعال" : "غیرفعال"}
          </span>
        </div>
        <p className="text-sm text-gray-500">تاریخ عضویت: {createdAt}</p>
      </div>
      <div className="admin-card-actions absolute top-3 left-3 lg:static">
        <button type="button" className="admin-action-edit" onClick={handleToggle}>
          {subscriber.is_active ? (
            <ToggleOffOutlinedIcon sx={{ fontSize: 16 }} />
          ) : (
            <ToggleOnOutlinedIcon sx={{ fontSize: 16 }} />
          )}
          {subscriber.is_active ? "غیرفعال" : "فعال"}
        </button>
        <button type="button" className="admin-action-delete" onClick={handleDelete}>
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          حذف
        </button>
      </div>
    </div>
  );
}

export default SubscriberBox;
