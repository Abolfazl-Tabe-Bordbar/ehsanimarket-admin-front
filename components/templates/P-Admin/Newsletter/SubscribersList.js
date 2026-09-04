"use client";

import React, { useState } from "react";
import SubscriberBox from "./SubscriberBox";
import getNewsletterSubscribers from "@/funcs/getNewsletterSubscribers";
import exportNewsletterExcel from "@/funcs/exportNewsletterExcel";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";
import Loader from "@/components/modules/Loader";
import { apiBaseUrl } from "@/data/variables";
import NewsletterImportPanel from "./NewsletterImportPanel";

function SubscribersList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const refresh = () => {
    getNewsletterSubscribers(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res?.status) setShownData(res);
    });
  };

  const subscribers = shownData?.data || [];
  const stats = shownData?.stats || { total: 0, active: 0, inactive: 0 };

  const filtered = subscribers.filter((item) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return item.is_active;
    return !item.is_active;
  });

  const exportHandler = () => {
    setIsExporting(true);
    exportNewsletterExcel({
      status: statusFilter === "all" ? undefined : statusFilter,
    })
      .then((res) => {
        if (res?.file) {
          const linkElem = document.createElement("a");
          linkElem.href = `${apiBaseUrl}${res.file}`;
          linkElem.download = "";
          linkElem.click();
        }
      })
      .finally(() => setIsExporting(false));
  };

  return (
    <div className="my-6 space-y-5">
      {isExporting && <Loader />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-brand-navy/15 bg-brand-navy/[0.03] px-4 py-3">
          <p className="text-xs text-gray-500">کل مشترکین</p>
          <p className="text-xl font-bold text-brand-navy">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3">
          <p className="text-xs text-gray-500">فعال</p>
          <p className="text-xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3">
          <p className="text-xs text-gray-500">غیرفعال</p>
          <p className="text-xl font-bold text-gray-500">{stats.inactive}</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-gray-600 leading-6">
        <p className="font-bold text-brand-navy mb-1">راهنمای ورود از اکسل</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>فرمت فایل باید xlsx باشد.</li>
          <li>سطر اول عنوان ستون‌هاست (شماره موبایل، وضعیت).</li>
          <li>
            شماره موبایل الزامی است (مثال:{" "}
            <span className="dir-ltr inline-block">09121234567</span>).
          </li>
          <li>شماره تکراری به‌روزرسانی می‌شود؛ نامعتبرها نادیده گرفته می‌شوند.</li>
        </ul>
      </div>

      <div className="admin-section space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="admin-section-title !mb-0">مدیریت مشترکین</h3>
          <span className="text-xs text-gray-500">{filtered.length} مشترک</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-bold text-gray-600 mb-3">فیلتر و خروجی</p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1 min-w-[140px] space-y-1.5">
                <label htmlFor="newsletter-status-filter" className="block text-xs text-gray-500">
                  وضعیت
                </label>
                <select
                  id="newsletter-status-filter"
                  className="admin-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">همه</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>
              <button
                type="button"
                className="admin-btn-success !py-2 !px-4 text-sm shrink-0"
                onClick={exportHandler}
              >
                خروجی اکسل
              </button>
            </div>
          </div>

          <NewsletterImportPanel onImported={refresh} />
        </div>
      </div>

      {!filtered.length ? (
        <EmptyMessage
          text={
            statusFilter !== "all"
              ? "مشترکی با این فیلتر یافت نشد."
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
