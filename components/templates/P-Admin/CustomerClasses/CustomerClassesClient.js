"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import saveCustomerClass from "@/funcs/saveCustomerClass";
import deleteCustomerClass from "@/funcs/deleteCustomerClass";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function CustomerClassesClient({ initialClasses = [] }) {
  const [classes, setClasses] = useState(initialClasses);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setDiscountPercent("");
    setSortOrder("");
    setIsActive(true);
    setFormOpen(false);
  };

  const openAdd = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setName(row.name);
    setDiscountPercent(String(row.discount_percent ?? ""));
    setSortOrder(String(row.sort_order ?? ""));
    setIsActive(row.is_active !== false);
    setFormOpen(true);
  };

  const sortList = (list) =>
    [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id);

  const handleSave = async () => {
    if (name.trim().length < 2) {
      Swal.fire("توجه!", "نام کلاس باید حداقل ۲ کاراکتر باشد", "warning");
      return;
    }
    const percent = parseInt(discountPercent, 10);
    if (!Number.isFinite(percent) || percent < 1 || percent > 100) {
      Swal.fire("توجه!", "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد", "warning");
      return;
    }

    const payload = { name: name.trim(), discount_percent: percent, is_active: isActive };
    if (sortOrder !== "") payload.sort_order = Number(sortOrder);

    setIsLoading(true);
    const result = await saveCustomerClass(payload, editing?.id || null);
    setIsLoading(false);
    if (!result?.status) return;

    if (editing) {
      setClasses((prev) =>
        sortList(
          prev.map((item) =>
            item.id === editing.id
              ? { ...item, ...result.body, users_count: item.users_count }
              : item
          )
        )
      );
    } else if (result.body) {
      setClasses((prev) => sortList([...prev, result.body]));
    }
    resetForm();
  };

  const toggleActive = async (row) => {
    setIsLoading(true);
    const result = await saveCustomerClass(
      {
        name: row.name,
        discount_percent: row.discount_percent,
        is_active: !row.is_active,
      },
      row.id
    );
    setIsLoading(false);
    if (result?.status) {
      setClasses((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, is_active: !row.is_active } : item))
      );
    }
  };

  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: "حذف کلاس مشتری",
      text: `آیا از حذف «${row.name}» مطمئن هستید؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    const result = await deleteCustomerClass(row.id);
    setIsLoading(false);
    if (result?.status) {
      setClasses((prev) => prev.filter((item) => item.id !== row.id));
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
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 22 }} />
              </span>
              <div>
                <h3 className="font-semibold text-base text-brand-navy">کلاس‌های مشتری</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  تخفیف درصدی روی قیمت پایه محصول برای کاربران اختصاص‌داده‌شده؛ بدون کلاس = کاربر عادی.
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
                  افزودن کلاس
                </>
              )}
            </button>
          </div>

          {formOpen && (
            <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 space-y-4">
              <h4 className="font-semibold text-sm text-brand-navy">
                {editing ? `ویرایش «${editing.name}»` : "افزودن کلاس جدید"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">نام کلاس</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={name}
                    maxLength={64}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثلاً: VIP"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">درصد تخفیف از قیمت کالا</label>
                  <input
                    type="number"
                    dir="ltr"
                    min={1}
                    max={100}
                    className="admin-input text-center"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="۳۰"
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
                فعال (تخفیف برای کاربران این کلاس اعمال شود)
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                  انصراف
                </button>
                <button type="button" className="admin-btn-accent" onClick={handleSave}>
                  {editing ? "ذخیره تغییرات" : "ثبت کلاس"}
                </button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">ترتیب</th>
                  <th>نام</th>
                  <th className="w-28">تخفیف</th>
                  <th className="w-24">وضعیت</th>
                  <th className="w-32">کاربران</th>
                  <th className="w-40 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {!classes.length ? (
                  <tr>
                    <td colSpan={6} className="text-center text-sm text-gray-500 py-8">
                      هنوز کلاسی تعریف نشده است.
                    </td>
                  </tr>
                ) : (
                  classes.map((row) => (
                    <tr key={row.id}>
                      <td className="text-gray-400 text-xs">{fa(row.sort_order)}</td>
                      <td className="font-medium text-gray-800">{row.name}</td>
                      <td className="text-sm">{fa(row.discount_percent)}٪</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleActive(row)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            row.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          title="تغییر وضعیت"
                        >
                          {row.is_active ? "فعال" : "غیرفعال"}
                        </button>
                      </td>
                      <td className="text-xs text-gray-600">{fa(row.users_count)} نفر</td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                            onClick={() => openEdit(row)}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 14 }} />
                            ویرایش
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(row)}
                          >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default CustomerClassesClient;