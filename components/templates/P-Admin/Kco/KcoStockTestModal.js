"use client";

import { useState } from "react";
import Loader from "@/components/modules/Loader";
import { previewKcoStock } from "@/funcs/kco";
import CloseIcon from "@mui/icons-material/Close";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function num3(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const rounded = Math.round(n * 1000) / 1000;
  return fa(rounded);
}

function KcoStockTestModal({ onClose }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const runTest = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("کد کالا را وارد کنید");
      setResult(null);
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    const res = await previewKcoStock(trimmed);
    setBusy(false);
    if (!res?.status) {
      setError(res?.message || "خطا در دریافت موجودی");
      return;
    }
    setResult(res.body);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-brand-navy/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {busy && <Loader />}
      <div
        className="admin-card w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ScienceOutlinedIcon className="text-brand-navy" sx={{ fontSize: 22 }} />
            <div>
              <h3 className="font-bold text-brand-navy text-base">تست موجودی کارآمد</h3>
              <p className="text-xs text-gray-500 mt-0.5">فقط نمایش — هیچ تغییری در سایت ذخیره نمی‌شود</p>
            </div>
          </div>
          <button type="button" className="text-gray-400 hover:text-gray-600 p-1" onClick={onClose} aria-label="بستن">
            <CloseIcon sx={{ fontSize: 22 }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">کد کالا</label>
            <input
              type="text"
              className="admin-input dir-ltr"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثلاً 13454"
              onKeyDown={(e) => e.key === "Enter" && runTest()}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>
              بستن
            </button>
            <button type="button" className="admin-btn-primary" onClick={runTest} disabled={busy}>
              بررسی موجودی
            </button>
          </div>

          {error ? <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p> : null}

          {result ? (
            <div className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50/80">
              <p className="text-sm font-semibold text-brand-navy">{result.goodsName || "—"}</p>

              <div className="admin-table-wrap border-0 shadow-none rounded-lg overflow-hidden">
                <table className="admin-table text-sm w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="w-auto">انبار</th>
                      <th className="w-24">کد انبار</th>
                      <th className="w-28">موجودی آزاد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.stores?.map((row) => (
                      <tr key={row.storeRef}>
                        <td className="text-gray-800">{row.storeName}</td>
                        <td className="dir-ltr tabular-nums text-gray-600 text-center">{row.storeRef}</td>
                        <td className="dir-ltr tabular-nums font-medium text-brand-navy text-center">
                          {num3(row.free)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white font-semibold border-t border-gray-200">
                      <td colSpan={2} className="text-sm text-gray-800">
                        جمع
                      </td>
                      <td className="dir-ltr tabular-nums text-brand-navy text-center">{num3(result.totalFree)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default KcoStockTestModal;