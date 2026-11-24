"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import saveOrgUnit from "@/funcs/saveOrgUnit";
import deleteOrgUnit from "@/funcs/deleteOrgUnit";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function OrgUnitsClient({ initialUnits }) {
  const [units, setUnits] = useState(initialUnits || []);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");

  const resetForm = () => {
    setEditing(null);
    setName("");
    setFormOpen(false);
  };

  const openAdd = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (unit) => {
    setEditing(unit);
    setName(unit.name || "");
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      Swal.fire("توجه!", "نام واحد باید حداقل ۲ کاراکتر باشد", "warning");
      return;
    }

    setIsLoading(true);
    const result = await saveOrgUnit({ name: name.trim() }, editing?.id || null);
    setIsLoading(false);
    if (!result?.status) return;

    if (editing) {
      setUnits((prev) =>
        prev
          .map((item) => (item.id === editing.id ? { ...item, ...result.body } : item))
          .sort((a, b) => String(a.name).localeCompare(String(b.name), "fa"))
      );
    } else if (result.body) {
      setUnits((prev) =>
        [...prev, result.body].sort((a, b) => String(a.name).localeCompare(String(b.name), "fa"))
      );
    }
    resetForm();
  };

  const handleDelete = async (unit) => {
    const confirm = await Swal.fire({
      title: "حذف واحد",
      text: `آیا از حذف «${unit.name}» مطمئن هستید؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;

    setIsLoading(true);
    const result = await deleteOrgUnit(unit.id);
    setIsLoading(false);
    if (result?.status) {
      setUnits((prev) => prev.filter((item) => item.id !== unit.id));
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
                <AccountTreeOutlinedIcon sx={{ fontSize: 22 }} />
              </span>
              <div>
                <h3 className="font-semibold text-base text-brand-navy">واحدهای سازمان</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {fa(units.length)} واحد تعریف شده است. هر مدیر می‌تواند به یک یا چند واحد متصل شود.
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
                  افزودن واحد
                </>
              )}
            </button>
          </div>

          {formOpen && (
            <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 space-y-4">
              <h4 className="font-semibold text-sm text-brand-navy">
                {editing ? `ویرایش «${editing.name}»` : "افزودن واحد جدید"}
              </h4>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">نام واحد</label>
                <input
                  type="text"
                  className="admin-input"
                  value={name}
                  maxLength={64}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: مالی"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                  انصراف
                </button>
                <button type="button" className="admin-btn-accent" onClick={handleSave}>
                  {editing ? "ذخیره تغییرات" : "ثبت واحد"}
                </button>
              </div>
            </div>
          )}

          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>نام واحد</th>
                  <th className="w-40">تعداد مدیران</th>
                  <th className="w-40 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {!units.length ? (
                  <tr>
                    <td colSpan={3} className="text-center text-sm text-gray-500 py-8">
                      هنوز واحدی ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  units.map((unit) => (
                    <tr key={unit.id}>
                      <td className="font-medium text-gray-800">{unit.name}</td>
                      <td>{fa(unit.admins_count)}</td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="admin-action admin-action-edit"
                            onClick={() => openEdit(unit)}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                            ویرایش
                          </button>
                          <button
                            type="button"
                            className="admin-action admin-action-delete"
                            onClick={() => handleDelete(unit)}
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

export default OrgUnitsClient;
