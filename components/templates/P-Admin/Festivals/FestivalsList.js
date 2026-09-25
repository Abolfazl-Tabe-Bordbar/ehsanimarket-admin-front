"use client";
import React, { useEffect, useState } from "react";
import FestivalBox from "./FestivalBox";
import EmptyMessage from "@/components/modules/EmptyMessage";
import getFestivals from "@/funcs/getFestivals";
import getCookie from "@/funcs/cookies/getCookie";

function FestivalsList({ data, refreshKey = 0, editingId = null, onEdit }) {
  const [shownData, setShownData] = useState(data);

  const refresh = () => {
    getFestivals(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    setShownData(data);
  }, [data]);

  useEffect(() => {
    if (refreshKey > 0) refresh();
  }, [refreshKey]);

  const festivals = shownData?.body || [];
  const now = Date.now();
  const activeNow = festivals.filter((item) => {
    if (!item.is_active) return false;
    const start = new Date(item.starts_at).getTime();
    const end = new Date(item.ends_at).getTime();
    return start <= now && end >= now;
  }).length;

  return (
    <div className="my-2">
      {festivals.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="admin-card flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">تعداد جشنواره‌ها</span>
            <span className="text-lg font-bold text-[#141c32]">{festivals.length}</span>
          </div>
          <div className="admin-card flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">در حال اجرا</span>
            <span className="text-lg font-bold text-emerald-700">{activeNow}</span>
          </div>
          <div className="admin-card flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-600">فعال در پنل</span>
            <span className="text-lg font-bold text-[#CA8549]">
              {festivals.filter((item) => item.is_active).length}
            </span>
          </div>
        </div>
      )}

      {!festivals.length ? (
        <EmptyMessage text="هیچ جشنواره‌ای ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {festivals.map((festival) => (
            <FestivalBox
              key={festival.id}
              festival={festival}
              isEditing={editingId === festival.id}
              onEdit={() => onEdit?.(festival)}
              onChanged={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FestivalsList;
