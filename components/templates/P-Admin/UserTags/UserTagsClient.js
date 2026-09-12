"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import saveUserTag from "@/funcs/saveUserTag";
import deleteUserTag from "@/funcs/deleteUserTag";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

const DEFAULT_COLOR = "#3B82F6";

const COLOR_PRESETS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#64748B",
];

function TagBadge({ tag, size = "md" }) {
  const sizeClass =
    size === "lg"
      ? "px-3 py-1 text-sm"
      : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium text-white whitespace-nowrap ${sizeClass}`}
      style={{ backgroundColor: tag.color }}
    >
      {tag.name}
    </span>
  );
}

function UserTagsClient({ initialTags }) {
  const [tags, setTags] = useState(initialTags);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setEditingTag(null);
    setName("");
    setColor(DEFAULT_COLOR);
    setDescription("");
    setFormOpen(false);
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (tag) => {
    setEditingTag(tag);
    setName(tag.name);
    setColor(tag.color);
    setDescription(tag.description || "");
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Swal.fire("توجه!", "نام تگ الزامی است", "warning");
      return;
    }

    setIsLoading(true);
    const result = await saveUserTag(
      {
        name: name.trim(),
        color,
        description: description.trim(),
      },
      editingTag?.id || null
    );
    setIsLoading(false);

    if (!result?.status) return;

    if (editingTag) {
      setTags((prev) =>
        prev.map((tag) =>
          tag.id === editingTag.id
            ? { ...tag, name: name.trim(), color, description: description.trim() }
            : tag
        )
      );
    } else if (result.body) {
      setTags((prev) => [...prev, result.body]);
    } else {
      setTags((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: name.trim(),
          color,
          description: description.trim(),
        },
      ]);
    }

    resetForm();
  };

  const handleDelete = async (tag) => {
    const confirm = await Swal.fire({
      title: "حذف تگ",
      text: `آیا از حذف تگ «${tag.name}» مطمئن هستید؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });

    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    const result = await deleteUserTag(tag.id);
    setIsLoading(false);

    if (result?.status) {
      setTags((prev) => prev.filter((item) => item.id !== tag.id));
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="admin-section space-y-5">
        <div className="admin-card overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-navy/8 text-brand-navy shrink-0">
                <LabelOutlinedIcon sx={{ fontSize: 22 }} />
              </span>
              <div>
                <h3 className="font-semibold text-base text-brand-navy">لیست تگ‌ها</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {tags.length
                    ? `${tags.length.toLocaleString("fa-IR")} تگ تعریف شده`
                    : "هنوز تگی تعریف نشده است"}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="admin-btn-primary inline-flex items-center justify-center gap-1.5 shrink-0"
              onClick={formOpen ? resetForm : openAddForm}
            >
              {formOpen ? (
                <>
                  <CloseIcon sx={{ fontSize: 18 }} />
                  بستن فرم
                </>
              ) : (
                <>
                  <AddOutlinedIcon sx={{ fontSize: 18 }} />
                  افزودن تگ
                </>
              )}
            </button>
          </div>

          {formOpen && (
            <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-sm text-brand-navy">
                  {editingTag ? `ویرایش «${editingTag.name}»` : "افزودن تگ جدید"}
                </h4>
                <TagBadge tag={{ name: name.trim() || "نمونه تگ", color }} size="lg" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1.5 block">نام تگ</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثلاً: همکاران"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1.5 block">رنگ</label>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setColor(preset)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-105 ${
                            color === preset ? "border-brand-navy ring-2 ring-brand-navy/20" : "border-white shadow-sm"
                          }`}
                          style={{ backgroundColor: preset }}
                          title={preset}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        className="admin-input flex-1 dir-ltr"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1.5 block">توضیح</label>
                    <textarea
                      rows="3"
                      className="admin-input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="توضیح کوتاه درباره این تگ..."
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 flex flex-col items-center justify-center gap-3 min-h-[140px] lg:min-w-[200px]">
                  <span
                    className="inline-block w-12 h-12 rounded-full ring-4 ring-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                  <TagBadge tag={{ name: name.trim() || "نمونه تگ", color }} size="lg" />
                  <p className="text-[11px] text-gray-400 dir-ltr">{color}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                  انصراف
                </button>
                <button type="button" className="admin-btn-accent" onClick={handleSave}>
                  {editingTag ? "ذخیره تغییرات" : "ثبت تگ"}
                </button>
              </div>
            </div>
          )}

          {!tags.length ? (
            <div className="p-10 sm:p-14 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 mb-4">
                <LabelOutlinedIcon sx={{ fontSize: 28 }} />
              </div>
              <p className="text-sm text-gray-600 mb-1">هنوز تگی تعریف نشده است</p>
              <p className="text-xs text-gray-400 mb-5">با تگ‌ها می‌توانید کاربران را دسته‌بندی کنید</p>
              {!formOpen && (
                <button type="button" className="admin-btn-primary inline-flex items-center gap-1.5" onClick={openAddForm}>
                  <AddOutlinedIcon sx={{ fontSize: 18 }} />
                  اولین تگ را بسازید
                </button>
              )}
            </div>
          ) : (
            <div className="admin-table-wrap border-0 rounded-none shadow-none">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th className="w-16">رنگ</th>
                    <th>نام تگ</th>
                    <th>توضیح</th>
                    <th className="w-40 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag, index) => (
                    <tr key={tag.id} className="group">
                      <td className="text-gray-400 text-xs">{index + 1}</td>
                      <td>
                        <span
                          className="inline-block w-7 h-7 rounded-full ring-2 ring-white shadow-sm"
                          style={{ backgroundColor: tag.color }}
                          title={tag.color}
                        />
                      </td>
                      <td className="whitespace-nowrap">
                        <TagBadge tag={tag} />
                      </td>
                      <td className="max-w-[280px]">
                        {tag.description ? (
                          <p className="text-sm text-gray-600 line-clamp-2">{tag.description}</p>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            onClick={() => openEditForm(tag)}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 14 }} />
                            ویرایش
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(tag)}
                          >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default UserTagsClient;
