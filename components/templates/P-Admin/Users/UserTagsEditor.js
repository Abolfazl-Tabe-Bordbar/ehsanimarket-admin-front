"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/components/modules/Loader";
import getUserTags from "@/funcs/getUserTags";
import setUserTags from "@/funcs/setUserTags";
import getCookie from "@/funcs/cookies/getCookie";

function UserTagsEditor({ userId, initialTags = [], onUpdated }) {
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState(
    initialTags.map((tag) => tag.id)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getUserTags(getCookie("ramian-pakhsh-admin")).then((res) => {
      if (res?.status) {
        setAllTags(res.body || []);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setSelectedTagIds(initialTags.map((tag) => tag.id));
  }, [initialTags]);

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await setUserTags(userId, selectedTagIds);
    setIsSaving(false);

    if (result?.status && onUpdated) {
      onUpdated(result.body?.tags || []);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-4">
      <h4 className="font-semibold text-sm text-brand-navy">تگ‌های کاربر</h4>

      {!allTags.length ? (
        <p className="text-sm text-gray-500">هنوز تگی تعریف نشده است.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border transition ${
                  active ? "text-white border-transparent" : "bg-white text-gray-700 border-gray-200"
                }`}
                style={active ? { backgroundColor: tag.color } : undefined}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          className="admin-btn-accent text-xs px-4 py-2"
          onClick={handleSave}
          disabled={isSaving}
        >
          ذخیره تگ‌ها
        </button>
      </div>
    </div>
  );
}

export default UserTagsEditor;
