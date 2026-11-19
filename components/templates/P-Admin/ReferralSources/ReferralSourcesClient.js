"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import saveReferralSource from "@/funcs/saveReferralSource";
import deleteReferralSource from "@/funcs/deleteReferralSource";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function ReferralSourcesClient({ initialSources, otherCount = 0 }) {
  const [sources, setSources] = useState(initialSources);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isActive, setIsActive] = useState(true);

  const totalUsers = sources.reduce((sum, item) => sum + Number(item.users_count || 0), 0) + otherCount;

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setSortOrder("");
    setIsActive(true);
    setFormOpen(false);
  };

  const openAdd = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (source) => {
    setEditing(source);
    setTitle(source.title);
    setSortOrder(String(source.sort_order ?? ""));
    setIsActive(source.is_active !== false);
    setFormOpen(true);
  };

  const sortList = (list) =>
    [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id);

  const handleSave = async () => {
    if (title.trim().length < 2) {
      Swal.fire("توجه!", "عنوان باید حداقل ۲ کاراکتر باشد", "warning");
      return;
    }

    const payload = { title: title.trim(), is_active: isActive };
    if (sortOrder !== "") payload.sort_order = Number(sortOrder);

    setIsLoading(true);
    const result = await saveReferralSource(payload, editing?.id || null);
    setIsLoading(false);
    if (!result?.status) return;

    if (editing) {
      setSources((prev) =>
        sortList(prev.map((item) => (item.id === editing.id ? { ...item, ...result.body } : item)))
      );
    } else if (result.body) {
      setSources((prev) => sortList([...prev, result.body]));
    }
    resetForm();
  };

  const toggleActive = async (source) => {
    setIsLoading(true);
    const result = await saveReferralSource(
      { title: source.title, is_active: !source.is_active },
      source.id
    );
    setIsLoading(false);
    if (result?.status) {
      setSources((prev) =>
        prev.map((item) => (item.id === source.id ? { ...item, is_active: !source.is_active } : item))
      );
    }
  };

  const handleDelete = async (source) => {
    const confirm = await Swal.fire({
      title: "حذف گزینه",
      text: `آیا از حذف «${source.title}» مطمئن هستید؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    const result = await deleteReferralSource(source.id);
    setIsLoading(false);
    if (result?.status) {
      setSources((prev) => prev.filter((item) => item.id !== source.id));
    }
  };

  const percent = (count) => (totalUsers ? Math.round((Number(count) / totalUsers) * 100) : 0);

  return (
    <>
      {isLoading && <Loader />}
      <section className="admin-section space-y-5">
        <div className="admin-card overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-navy/8 text-brand-navy shrink-0">
                <CampaignOutlinedIcon sx={{ fontSize: 22 }} />
              </span>
              <div>
                <h3 className="font-semibold text-base text-brand-navy">گزینه‌های نحوه آشنایی</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {fa(totalUsers)} کاربر نحوه آشنایی را مشخص کرده‌اند. گزینه «سایر» همیشه برای کاربر نمایش داده می‌شود.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="admin-btn-primary inline-flex items-center justify-center gap-1.5 shrink-0"
              onClick={formOpen ? resetForm : openAdd}
            >
              {formOpen ? (
                <>
                  <CloseIcon sx={{ fontSize: 18 }} />
                  بستن فرم
                </>
              ) : (
                <>
                  <AddOutlinedIcon sx={{ fontSize: 18 }} />
                  افزودن گزینه
                </>
              )}
            </button>
          </div>

          {formOpen && (
            <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 space-y-4">
              <h4 className="font-semibold text-sm text-brand-navy">
                {editing ? `ویرایش «${editing.title}»` : "افزودن گزینه جدید"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">عنوان</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={title}
                    maxLength={60}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: اینستاگرام"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">ترتیب نمایش</label>
                  <input
                    type="number"
                    dir="ltr"
                    className="admin-input text-center"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    placeholder="خودکار"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                برای کاربران نمایش داده شود
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                  انصراف
                </button>
                <button type="button" className="admin-btn-accent" onClick={handleSave}>
                  {editing ? "ذخیره تغییرات" : "ثبت گزینه"}
                </button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">ترتیب</th>
                  <th>عنوان</th>
                  <th className="w-24">وضعیت</th>
                  <th className="w-48">تعداد کاربران</th>
                  <th className="w-40 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id}>
                    <td className="text-gray-400 text-xs">{fa(source.sort_order)}</td>
                    <td className="font-medium text-gray-800">{source.title}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleActive(source)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          source.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        title="تغییر وضعیت"
                      >
                        {source.is_active ? "فعال" : "غیرفعال"}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#CA8549]"
                            style={{ width: `${percent(source.users_count)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {fa(source.users_count)} ({fa(percent(source.users_count))}٪)
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                          onClick={() => openEdit(source)}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 14 }} />
                          ویرایش
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(source)}
                        >
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50/60">
                  <td className="text-gray-300 text-xs">—</td>
                  <td className="text-gray-600">سایر (متن دلخواه کاربر)</td>
                  <td>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      همیشه
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-gray-600">
                      {fa(otherCount)} ({fa(percent(otherCount))}٪)
                    </span>
                  </td>
                  <td className="text-left text-[11px] text-gray-400">متن‌ها در جزئیات کاربر و خروجی اکسل</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default ReferralSourcesClient;
