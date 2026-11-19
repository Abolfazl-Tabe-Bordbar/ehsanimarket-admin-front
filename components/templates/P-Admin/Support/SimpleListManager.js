"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Loader from "@/components/modules/Loader";
import { fa } from "./supportHelpers";

/**
 * مدیریت لیست ساده (موضوعات تیکت، پاسخ‌های آماده)
 * fields: [{ key, label, type: "text"|"textarea"|"checkbox"|"number", default, placeholder, max }]
 */
function SimpleListManager({ title, itemLabel, fields, load, save, remove, renderCells, columns, canEdit = true }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => load().then((res) => setItems(res?.status ? res.body : []));
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const empty = () => Object.fromEntries(fields.map((field) => [field.key, field.default ?? ""]));
  const openAdd = () => {
    setEditing(null);
    setForm(empty());
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm(Object.fromEntries(fields.map((field) => [field.key, item[field.key] ?? field.default ?? ""])));
  };

  const submit = async () => {
    setBusy(true);
    const res = await save(form, editing?.id);
    setBusy(false);
    if (res?.status) {
      setForm(null);
      setEditing(null);
      refresh();
    }
  };

  const handleDelete = async (item) => {
    const confirm = await Swal.fire({
      title: `حذف ${itemLabel}`,
      text: "آیا مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;
    setBusy(true);
    const res = await remove(item.id);
    setBusy(false);
    if (res?.status) refresh();
  };

  return (
    <section className="admin-section">
      {busy && <Loader />}
      <div className="admin-card !p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-navy">{title}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{items ? `${fa(items.length)} مورد` : ""}</p>
          </div>
          {canEdit && (
            <button type="button" className="admin-btn-primary inline-flex items-center gap-1.5" onClick={form ? () => setForm(null) : openAdd}>
              {form ? <CloseIcon sx={{ fontSize: 18 }} /> : <AddOutlinedIcon sx={{ fontSize: 18 }} />}
              {form ? "بستن فرم" : `افزودن ${itemLabel}`}
            </button>
          )}
        </div>

        {form && (
          <div className="space-y-4 border-b border-gray-100 bg-gray-50/70 p-5">
            <h4 className="text-sm font-semibold text-brand-navy">{editing ? `ویرایش ${itemLabel}` : `${itemLabel} جدید`}</h4>
            {fields.map((field) =>
              field.type === "checkbox" ? (
                <label key={field.key} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.key])}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.checked }))}
                  />
                  {field.label}
                </label>
              ) : (
                <div key={field.key}>
                  <label className="mb-1.5 block text-sm text-gray-600">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={4}
                      maxLength={field.max}
                      className="admin-input !rounded-xl"
                      value={form[field.key]}
                      placeholder={field.placeholder}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      dir={field.type === "number" ? "ltr" : undefined}
                      maxLength={field.max}
                      className={`admin-input ${field.type === "number" ? "max-w-[160px] text-center" : ""}`}
                      value={form[field.key]}
                      placeholder={field.placeholder}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              )
            )}
            <div className="flex justify-end gap-2">
              <button type="button" className="admin-btn-secondary" onClick={() => setForm(null)}>انصراف</button>
              <button type="button" className="admin-btn-accent" onClick={submit}>{editing ? "ذخیره تغییرات" : "ثبت"}</button>
            </div>
          </div>
        )}

        {items === null ? (
          <p className="p-10 text-center text-sm text-gray-400">در حال بارگذاری...</p>
        ) : !items.length ? (
          <p className="p-10 text-center text-sm text-gray-400">موردی ثبت نشده است</p>
        ) : (
          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  {canEdit && <th className="w-40 text-left">عملیات</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {renderCells(item)}
                    {canEdit && (
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50" onClick={() => openEdit(item)}>
                            <EditOutlinedIcon sx={{ fontSize: 14 }} />
                            ویرایش
                          </button>
                          <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50" onClick={() => handleDelete(item)}>
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                            حذف
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default SimpleListManager;
