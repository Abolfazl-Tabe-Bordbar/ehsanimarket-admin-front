"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import saveWarehouse from "@/funcs/saveWarehouse";
import deleteWarehouse from "@/funcs/deleteWarehouse";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function WarehousesClient({ initialRows }) {
  const [rows, setRows] = useState(initialRows || []);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setCode("");
    setIsActive(true);
    setFormOpen(false);
  };

  const openAdd = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setName(row.name || "");
    setCode(row.code || "");
    setIsActive(row.is_active !== false);
    setFormOpen(true);
  };

  const sortRows = (list) =>
    [...list].sort((a, b) => {
      if (Boolean(b.is_active) !== Boolean(a.is_active)) {
        return Number(b.is_active) - Number(a.is_active);
      }
      return String(a.name).localeCompare(String(b.name), "fa");
    });

  const handleSave = async () => {
    if (name.trim().length < 2) {
      Swal.fire("توجه!", "نام انبار باید حداقل ۲ کاراکتر باشد", "warning");
      return;
    }
    const codeTrim = code.trim();
    const codeLatin = codeTrim.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    if (codeLatin.length < 1) {
      Swal.fire("توجه!", "کد انبار (شناسه StoreRef کارآمد) الزامی است", "warning");
      return;
    }
    if (!/^\d+$/.test(codeLatin)) {
      Swal.fire("توجه!", "کد انبار باید عدد باشد (مثلاً 1 یا 3 — همان StoreRef در کارآمد)", "warning");
      return;
    }

    setIsLoading(true);
    const payload = {
      name: name.trim(),
      code: codeLatin,
      is_active: isActive,
    };
    const result = await saveWarehouse(payload, editing?.id || null);
    setIsLoading(false);
    if (!result?.status) return;

    if (editing) {
      setRows((prev) => sortRows(prev.map((item) => (item.id === editing.id ? { ...item, ...result.body } : item))));
    } else if (result.body) {
      setRows((prev) => sortRows([...prev, result.body]));
    }
    resetForm();
  };

  const toggleActive = async (row) => {
    setIsLoading(true);
    const result = await saveWarehouse(
      { name: row.name, code: row.code, is_active: !row.is_active },
      row.id
    );
    setIsLoading(false);
    if (result?.status) {
      setRows((prev) =>
        sortRows(
          prev.map((item) =>
            item.id === row.id ? { ...item, is_active: !row.is_active } : item
          )
        )
      );
    }
  };

  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: "حذف انبار",
      text: `آیا از حذف «${row.name}» مطمئن هستید؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    const result = await deleteWarehouse(row.id);
    setIsLoading(false);
    if (result?.status) {
      setRows((prev) => prev.filter((item) => item.id !== row.id));
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
                <WarehouseOutlinedIcon sx={{ fontSize: 22 }} />
              </span>
              <div>
                <h3 className="font-semibold text-base text-brand-navy">انبارها</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {fa(rows.length)} انبار تعریف شده است. برای همگام‌سازی کارآمد، کد = شناسه{" "}
                  <span className="dir-ltr">StoreRef</span>.
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
                  افزودن انبار
                </>
              )}
            </button>
          </div>

          {formOpen && (
            <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 space-y-4">
              <h4 className="font-semibold text-sm text-brand-navy">
                {editing ? `ویرایش «${editing.name}»` : "افزودن انبار جدید"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">نام انبار</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={name}
                    maxLength={64}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثلاً: انبار مرکزی"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">کد انبار</label>
                  <input
                    type="text"
                    className="admin-input"
                    dir="ltr"
                    value={code}
                    maxLength={32}
                    onChange={(e) => setCode(e.target.value.replace(/[^\d۰-۹]/g, ""))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="شناسه انبار در کارآمد (مثلاً: 3)"
                    disabled={Boolean(editing)}
                  />
                  {editing && (
                    <p className="text-xs text-gray-400 mt-1">کد انبار بعد از ثبت قابل تغییر نیست.</p>
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                انبار فعال است
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                  انصراف
                </button>
                <button type="button" className="admin-btn-accent" onClick={handleSave}>
                  {editing ? "ذخیره تغییرات" : "ثبت انبار"}
                </button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th className="w-36">کد</th>
                  <th className="w-28">وضعیت</th>
                  <th className="w-44 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {!rows.length ? (
                  <tr>
                    <td colSpan={4} className="text-center text-sm text-gray-500 py-8">
                      هنوز انباری ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className={!row.is_active ? "opacity-70" : undefined}>
                      <td className="font-medium text-gray-800">{row.name}</td>
                      <td dir="ltr" className="font-mono text-sm text-gray-600">
                        {row.code}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                            row.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                          onClick={() => toggleActive(row)}
                        >
                          {row.is_active ? "فعال" : "غیرفعال"}
                        </button>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="admin-action admin-action-edit"
                            onClick={() => openEdit(row)}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                            ویرایش
                          </button>
                          <button
                            type="button"
                            className="admin-action admin-action-delete"
                            onClick={() => handleDelete(row)}
                          >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
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

export default WarehousesClient;