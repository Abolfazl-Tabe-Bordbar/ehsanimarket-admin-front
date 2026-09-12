"use client";

import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import previewUserSms from "@/funcs/previewUserSms";
import sendUserSms from "@/funcs/sendUserSms";
import getUsers from "@/funcs/getUsers";
import getUserSmsBroadcastLogs from "@/funcs/getUserSmsBroadcastLogs";
import getCookie from "@/funcs/cookies/getCookie";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Link from "next/link";

function TagSelectCard({ tag, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-right rounded-xl border-2 p-3 transition-all ${
        checked
          ? "border-current shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80"
      }`}
      style={
        checked
          ? {
              borderColor: tag.color,
              backgroundColor: `${tag.color}12`,
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full shrink-0 ring-2 ring-white"
              style={{ backgroundColor: tag.color }}
            />
            <span className="font-medium text-sm text-brand-navy truncate">{tag.name}</span>
          </div>
        </div>
        <span
          className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            checked ? "border-transparent text-white" : "border-gray-300 bg-white"
          }`}
          style={checked ? { backgroundColor: tag.color } : undefined}
        >
          {checked ? <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> : null}
        </span>
      </div>
    </button>
  );
}

function SectionCard({ icon: Icon, title, description, children, className = "" }) {
  return (
    <div className={`admin-card p-5 sm:p-6 space-y-5 ${className}`}>
      <div className="flex items-start gap-3 pb-1 border-b border-gray-100">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-navy/8 text-brand-navy shrink-0">
          <Icon sx={{ fontSize: 22 }} />
        </span>
        <div>
          <h3 className="font-semibold text-base text-brand-navy">{title}</h3>
          {description ? <p className="text-xs text-gray-500 mt-0.5">{description}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

function UserSmsClient({ initialTags, initialBroadcasts, initialBroadcastsCount }) {
  const [tags] = useState(initialTags);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [extraUsers, setExtraUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [preview, setPreview] = useState(null);
  const [broadcasts, setBroadcasts] = useState(initialBroadcasts);
  const [expandedBroadcastId, setExpandedBroadcastId] = useState(null);
  const [broadcastLogs, setBroadcastLogs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedTagIds.includes(tag.id)),
    [tags, selectedTagIds]
  );

  const payload = useMemo(
    () => ({
      tag_ids: selectedTagIds,
      extra_user_ids: extraUsers.map((user) => user.id),
    }),
    [selectedTagIds, extraUsers]
  );

  const hasSelection = selectedTagIds.length > 0 || extraUsers.length > 0;

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
    setPreview(null);
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    const result = await getUsers(getCookie("ramian-pakhsh-admin"), 0, 10, {
      q: searchQuery.trim(),
    });
    setIsLoading(false);

    if (result?.status) {
      setSearchResults(result.body || []);
    }
  };

  const addExtraUser = (user) => {
    if (extraUsers.some((item) => item.id === user.id)) return;
    setExtraUsers((prev) => [...prev, user]);
    setSearchResults([]);
    setSearchQuery("");
    setPreview(null);
  };

  const removeExtraUser = (userId) => {
    setExtraUsers((prev) => prev.filter((user) => user.id !== userId));
    setPreview(null);
  };

  const handlePreview = async () => {
    if (!hasSelection) {
      Swal.fire("توجه!", "حداقل یک تگ یا کاربر انتخاب کنید", "warning");
      return;
    }

    setIsLoading(true);
    const result = await previewUserSms(payload);
    setIsLoading(false);

    if (result?.status) {
      setPreview(result.body);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      Swal.fire("توجه!", "متن پیام الزامی است", "warning");
      return;
    }

    if (!preview) {
      Swal.fire("توجه!", "ابتدا پیش‌نمایش گیرندگان را بگیرید", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "ارسال پیامک",
      text: `پیام برای ${preview.count.toLocaleString("fa")} نفر ارسال شود؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ارسال",
      cancelButtonText: "انصراف",
    });

    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    const result = await sendUserSms({
      ...payload,
      message: message.trim(),
    });
    setIsLoading(false);

    if (result?.status) {
      setBroadcasts((prev) => [
        {
          id: result.body.broadcast_id,
          message: message.trim(),
          tag_ids: selectedTagIds,
          extra_user_ids: extraUsers.map((user) => user.id),
          total_recipients: result.body.total_recipients,
          success_count: result.body.success_count,
          fail_count: result.body.fail_count,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setPreview(null);
      setMessage("");
      setSelectedTagIds([]);
      setExtraUsers([]);
    }
  };

  const loadLogs = async (broadcastId) => {
    if (expandedBroadcastId === broadcastId) {
      setExpandedBroadcastId(null);
      setBroadcastLogs(null);
      return;
    }

    setIsLoading(true);
    const result = await getUserSmsBroadcastLogs(
      getCookie("ramian-pakhsh-admin"),
      broadcastId
    );
    setIsLoading(false);

    if (result?.status) {
      setExpandedBroadcastId(broadcastId);
      setBroadcastLogs(result.body);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="admin-section space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard
            icon={LabelOutlinedIcon}
            title="انتخاب گیرندگان"
            description="بر اساس تگ یا افزودن کاربران مشخص"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600">تگ‌های کاربر</p>
              {tags.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tags.map((tag) => (
                    <TagSelectCard
                      key={tag.id}
                      tag={tag}
                      checked={selectedTagIds.includes(tag.id)}
                      onToggle={() => toggleTag(tag.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-4 text-center text-sm text-gray-500">
                  هنوز تگی تعریف نشده.{" "}
                  <Link href="/p-admin/user-tags" className="text-brand-navy underline font-medium">
                    ایجاد تگ
                  </Link>
                </div>
              )}
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <PersonAddOutlinedIcon sx={{ fontSize: 16 }} />
                افزودن کاربر خاص
              </p>

              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <SearchOutlinedIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      sx={{ fontSize: 18 }}
                    />
                    <input
                      type="text"
                      className="admin-input w-full pr-10"
                      placeholder="نام، نام خانوادگی یا شماره موبایل..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                    />
                  </div>
                  <button
                    type="button"
                    className="admin-btn-primary shrink-0 !px-4"
                    onClick={searchUsers}
                    disabled={!searchQuery.trim()}
                  >
                    جستجو
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                    {searchResults.map((user) => {
                      const alreadyAdded = extraUsers.some((item) => item.id === user.id);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50/80"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-brand-navy truncate">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dir-ltr text-right">
                              {user.phone_number}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="admin-btn-primary text-xs !px-3 !py-1 shrink-0 disabled:opacity-50"
                            disabled={alreadyAdded}
                            onClick={() => addExtraUser(user)}
                          >
                            {alreadyAdded ? "اضافه شده" : "افزودن"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {extraUsers.length > 0 && (
                <div className="rounded-xl bg-sky-50/60 border border-sky-100 p-3 space-y-2">
                  <p className="text-xs font-medium text-sky-900">
                    کاربران اضافه‌شده ({extraUsers.length.toLocaleString("fa")})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {extraUsers.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-white border border-sky-100 px-2.5 py-1.5 text-xs shadow-sm"
                      >
                        <span className="font-medium text-brand-navy">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-gray-400 dir-ltr">{user.phone_number}</span>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="حذف"
                          onClick={() => removeExtraUser(user.id)}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                type="button"
                className="admin-btn-secondary inline-flex items-center justify-center gap-1.5"
                onClick={handlePreview}
                disabled={!hasSelection}
              >
                <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                پیش‌نمایش گیرندگان
              </button>
              {preview ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 text-sm font-medium">
                  {preview.count.toLocaleString("fa")} گیرنده آماده ارسال
                </span>
              ) : hasSelection ? (
                <span className="text-xs text-gray-500">برای مشاهده لیست نهایی، پیش‌نمایش بگیرید</span>
              ) : null}
            </div>

            {preview?.recipients?.length > 0 && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 overflow-hidden">
                <div className="px-3 py-2 bg-emerald-50/80 border-b border-emerald-100 text-xs font-medium text-emerald-900">
                  لیست گیرندگان
                </div>
                <div className="max-h-44 overflow-y-auto divide-y divide-emerald-100/80">
                  {preview.recipients.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-gray-800">{user.fullname}</span>
                      <span className="dir-ltr text-gray-500">{user.phone_number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={SendOutlinedIcon}
            title="متن پیام"
            description="پیامک برای همه گیرندگان ارسال می‌شود"
          >
            <div className="rounded-xl bg-amber-50/80 border border-amber-100 px-3 py-2.5 text-xs text-amber-900 leading-6">
              از متغیر <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-[11px]">fullname</code>{" "}
              برای نام کاربر در متن استفاده کنید.
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sms-message" className="text-xs font-bold text-gray-600">
                متن پیامک
              </label>
              <textarea
                id="sms-message"
                rows="8"
                className="admin-input min-h-[180px] resize-y"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="مثال: fullname عزیز، پیشنهاد ویژه احسانی مارکت برای شما فعال شد."
              />
              <p className="text-[11px] text-gray-400 text-left dir-ltr">
                {message.length} characters
              </p>
            </div>

            {message.trim() && preview && (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3">
                <p className="text-[11px] font-bold text-gray-500 mb-1.5">نمونه پیش‌نمایش</p>
                <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">
                  {message.replace(/fullname/g, preview.recipients?.[0]?.fullname || "کاربر")}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="admin-btn-accent inline-flex items-center gap-1.5 !px-6"
                onClick={handleSend}
                disabled={!message.trim() || !preview}
              >
                <SendOutlinedIcon sx={{ fontSize: 18 }} />
                ارسال پیامک
              </button>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          icon={HistoryOutlinedIcon}
          title="لاگ ارسال‌ها"
          description="تاریخچه پیامک‌های گروهی و جزئیات هر ارسال"
        >
          {!broadcasts.length ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
              <HistoryOutlinedIcon className="text-gray-300 mb-2" sx={{ fontSize: 40 }} />
              <p className="text-sm text-gray-500">هنوز ارسالی ثبت نشده است</p>
            </div>
          ) : (
            <div className="space-y-3">
              {broadcasts.map((item) => {
                const isExpanded = expandedBroadcastId === item.id;
                const failRate =
                  item.total_recipients > 0
                    ? Math.round((item.fail_count / item.total_recipients) * 100)
                    : 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-colors ${
                      isExpanded ? "border-brand-navy/20 bg-brand-navy/[0.02]" : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="p-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-brand-navy bg-brand-navy/8 px-2 py-0.5 rounded-md">
                            #{item.id}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 leading-6">{item.message}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5">
                            کل: {item.total_recipients.toLocaleString("fa")}
                          </span>
                          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5">
                            موفق: {item.success_count.toLocaleString("fa")}
                          </span>
                          {item.fail_count > 0 ? (
                            <span className="rounded-full bg-red-50 text-red-700 px-2.5 py-0.5">
                              ناموفق: {item.fail_count.toLocaleString("fa")}
                              {failRate > 0 ? ` (${failRate}%)` : ""}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="admin-btn-secondary text-xs px-4 py-2 shrink-0 self-start"
                        onClick={() => loadLogs(item.id)}
                      >
                        {isExpanded ? "بستن جزئیات" : "مشاهده جزئیات"}
                      </button>
                    </div>

                    {isExpanded && broadcastLogs?.logs && (
                      <div className="px-4 pb-4">
                        <div className="admin-table-wrap rounded-lg border border-gray-100 overflow-hidden">
                          <table className="admin-table text-xs">
                            <thead>
                              <tr>
                                <th>نام</th>
                                <th>شماره</th>
                                <th>وضعیت</th>
                                <th>خطا</th>
                              </tr>
                            </thead>
                            <tbody>
                              {broadcastLogs.logs.map((log) => (
                                <tr key={log.id}>
                                  <td>{log.fullname || "—"}</td>
                                  <td className="dir-ltr text-left">{log.phone}</td>
                                  <td>
                                    {log.status === "sent" ? (
                                      <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                                        ارسال شد
                                      </span>
                                    ) : (
                                      <span className="inline-flex rounded-full bg-red-50 text-red-700 px-2 py-0.5">
                                        ناموفق
                                      </span>
                                    )}
                                  </td>
                                  <td className="text-red-600 max-w-[200px] truncate">
                                    {log.error_message || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {initialBroadcastsCount > broadcasts.length && (
            <p className="text-xs text-gray-400 text-center pt-1">
              نمایش {broadcasts.length.toLocaleString("fa")} مورد از{" "}
              {initialBroadcastsCount.toLocaleString("fa")} ارسال
            </p>
          )}
        </SectionCard>
      </section>
    </>
  );
}

export default UserSmsClient;
