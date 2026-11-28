"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/components/modules/Loader";
import getCustomerClassesAdmin from "@/funcs/getCustomerClassesAdmin";
import setUserCustomerClass from "@/funcs/setUserCustomerClass";
import getCookie from "@/funcs/cookies/getCookie";

function UserCustomerClassEditor({ userId, initialCustomerClass = null, onUpdated }) {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedId, setSelectedId] = useState(initialCustomerClass?.id ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getCustomerClassesAdmin(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res?.status) {
        setAllClasses((res.body || []).filter((c) => c.is_active !== false));
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setSelectedId(initialCustomerClass?.id ?? null);
  }, [initialCustomerClass]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await setUserCustomerClass(userId, selectedId);
    setIsSaving(false);

    if (result?.status && onUpdated) {
      onUpdated(result.body?.customerClass ?? null);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-4">
      <h4 className="font-semibold text-sm text-brand-navy">کلاس مشتری</h4>
      <p className="text-xs text-gray-500">
        بدون انتخاب، کاربر عادی است و تخفیف کلاس اعمال نمی‌شود.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className={`rounded-full px-3 py-1 text-xs border transition ${
            selectedId == null
              ? "bg-brand-navy text-white border-transparent"
              : "bg-white text-gray-700 border-gray-200"
          }`}
        >
          کاربر عادی
        </button>
        {allClasses.map((cls) => {
          const active = selectedId === cls.id;
          return (
            <button
              key={cls.id}
              type="button"
              onClick={() => setSelectedId(cls.id)}
              className={`rounded-full px-3 py-1 text-xs border transition ${
                active
                  ? "bg-[#CA8549] text-white border-transparent"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {cls.name} ({Number(cls.discount_percent).toLocaleString("fa-IR")}٪)
            </button>
          );
        })}
      </div>

      {!allClasses.length ? (
        <p className="text-sm text-gray-500">ابتدا از منوی کاربران، کلاس مشتری تعریف کنید.</p>
      ) : null}

      <button
        type="button"
        className="admin-btn-accent text-sm px-4 py-2 disabled:opacity-50"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "در حال ذخیره…" : "ذخیره کلاس مشتری"}
      </button>
    </div>
  );
}

export default UserCustomerClassEditor;