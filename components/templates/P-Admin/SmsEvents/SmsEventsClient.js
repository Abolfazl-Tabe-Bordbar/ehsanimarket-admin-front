"use client";

import Loader from "@/components/modules/Loader";
import toggleSmsEvent from "@/funcs/toggleSmsEvent";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const CATEGORY_LABELS = {
  user: "رویدادهای کاربر",
  admin: "رویدادهای مدیر",
  marketing: "بازاریابی و اطلاع‌رسانی",
};

const CATEGORY_ORDER = ["user", "admin", "marketing"];

const TAG_ORDER = [
  "user_registration_otp",
  "user_reset_password",
  "user_login",
  "user_registration_welcome",
  "admin_product_balance",
  "product_back_in_stock",
  "article_published",
];

function SmsEventsClient({ systemMessages }) {
  const meta = systemMessages?.body?.meta || {};
  const initialData = systemMessages?.body?.data || [];

  const [events, setEvents] = useState(initialData);
  const [loadingId, setLoadingId] = useState(null);

  const groupedEvents = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => TAG_ORDER.indexOf(a.tag) - TAG_ORDER.indexOf(b.tag)
    );

    return CATEGORY_ORDER.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: sorted.filter((event) => meta[event.tag]?.category === category),
    })).filter((group) => group.items.length > 0);
  }, [events, meta]);

  const handleToggle = async (event) => {
    const nextEnabled = !event.is_enabled;
    setLoadingId(event.id);

    const result = await toggleSmsEvent(event.id, nextEnabled);

    if (result?.status) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id ? { ...item, is_enabled: nextEnabled } : item
        )
      );
    }

    setLoadingId(null);
  };

  return (
    <>
      {loadingId && <Loader />}
      <section className="admin-section space-y-8">
        <div className="text-sm text-gray-600 leading-7 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p>
            با خاموش کردن هر رویداد، ارسال پیامک مربوط به آن متوقف می‌شود.
            رویدادهای <strong>OTP</strong> (ثبت‌نام و بازیابی رمز) در صورت
            غیرفعال بودن، فرآیند مربوطه را مختل می‌کنند.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            برای ویرایش متن پیام‌ها به{" "}
            <Link
              href="/p-admin/system-notifications"
              className="text-brand-navy underline font-medium"
            >
              مدیریت پیام‌ها
            </Link>{" "}
            بروید.
          </p>
        </div>

        {groupedEvents.map((group) => (
          <div key={group.category} className="space-y-4">
            <h2 className="admin-section-title !border-0 !pb-0">{group.label}</h2>
            <div className="grid gap-4">
              {group.items.map((event) => {
                const info = meta[event.tag] || {};
                const isEnabled = event.is_enabled !== false;

                return (
                  <div
                    key={event.id}
                    className={`rounded-2xl border p-5 transition-colors ${
                      isEnabled
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-gray-200 bg-gray-50/80"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base text-brand-navy">
                            {info.title || event.tag}
                          </h3>
                          {info.critical && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              حیاتی
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isEnabled
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isEnabled ? "فعال" : "غیرفعال"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {info.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={isEnabled}
                        aria-label={`${isEnabled ? "غیرفعال" : "فعال"} کردن ${info.title || event.tag}`}
                        disabled={loadingId === event.id}
                        onClick={() => handleToggle(event)}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 disabled:opacity-50 ${
                          isEnabled ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? "ms-6" : "ms-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default SmsEventsClient;
