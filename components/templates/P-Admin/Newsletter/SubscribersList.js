"use client";

import React, { useState } from "react";
import SubscriberBox from "./SubscriberBox";
import getNewsletterSubscribers from "@/funcs/getNewsletterSubscribers";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";
import AdminSearchBar from "@/components/admin/ui/AdminSearchBar";

function SubscribersList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [search, setSearch] = useState("");

  const refresh = () => {
    getNewsletterSubscribers(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res?.status) setShownData(res);
    });
  };

  const subscribers = shownData?.data || [];
  const stats = shownData?.stats || { total: 0, active: 0, inactive: 0 };

  const filtered = subscribers.filter((item) =>
    item.phone?.includes(search.trim())
  );

  return (
    <div className="my-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-brand-navy/15 bg-brand-navy/[0.03] p-4">
          <p className="text-sm text-gray-500">کل مشترکین</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-sm text-gray-500">فعال</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
          <p className="text-sm text-gray-500">غیرفعال</p>
          <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
        </div>
      </div>

      <AdminSearchBar
        value={search}
        onChange={setSearch}
        onSearch={setSearch}
        onClear={() => setSearch("")}
        placeholder="جستجو بر اساس شماره موبایل..."
      />

      {!filtered.length ? (
        <EmptyMessage
          text={
            search.trim()
              ? "مشترکی با این شماره یافت نشد."
              : "هنوز کسی در خبرنامه ثبت‌نام نکرده است."
          }
        />
      ) : (
        <div className="admin-list">
          {filtered.map((subscriber) => (
            <SubscriberBox
              key={subscriber.id}
              subscriber={subscriber}
              onChange={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SubscribersList;
