"use client";

import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/modules/Loader";
import { getKcoStockSyncLogs, runKcoStockSyncNow, saveKcoStockSyncSettings } from "@/funcs/kco";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import KcoStockTestModal from "@/components/templates/P-Admin/Kco/KcoStockTestModal";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function KcoStockSyncLogs() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [busy, setBusy] = useState(false);
  const [scheduler, setScheduler] = useState(null);
  const [testOpen, setTestOpen] = useState(false);
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(30);

  const load = useCallback(async (p = 1) => {
    setBusy(true);
    const res = await getKcoStockSyncLogs(p);
    setBusy(false);
    if (res?.status) {
      setRows(res.body || []);
      setPage(res.pagination?.page || p);
      setPages(res.pagination?.pages || 1);
      if (res.scheduler) {
        setScheduler(res.scheduler);
        setAutoEnabled(Boolean(res.scheduler.cron_enabled));
        setIntervalMinutes(res.scheduler.interval_minutes ?? 30);
      }
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const runNow = async () => {
    if (scheduler?.sync_in_progress) return;
    setBusy(true);
    const res = await runKcoStockSyncNow();
    if (res?.scheduler) setScheduler(res.scheduler);
    setBusy(false);
    await load(1);
  };

  const saveSchedulerSettings = async () => {
    const minutes = Number(intervalMinutes);
    if (!Number.isFinite(minutes) || minutes < 5 || minutes > 1440) return;
    setBusy(true);
    const res = await saveKcoStockSyncSettings({
      enabled: autoEnabled,
      interval_minutes: minutes,
    });
    setBusy(false);
    if (!res?.status) return;
    if (res.scheduler) {
      setScheduler(res.scheduler);
      setAutoEnabled(Boolean(res.scheduler.cron_enabled));
      setIntervalMinutes(res.scheduler.interval_minutes ?? minutes);
    }
  };

  return (
    <section className="admin-section">
      {busy && <Loader />}
      <div className="admin-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-[#253c8a]">همگام‌سازی موجودی از کارآمد</h2>
              {scheduler ? (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    scheduler.cron_enabled && scheduler.scheduler_active
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                  }`}
                >
                  کرون: {scheduler.cron_enabled && scheduler.scheduler_active ? "روشن" : "خاموش"}
                </span>
              ) : null}
              {scheduler?.sync_in_progress ? (
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-800 ring-1 ring-amber-200">
                  در حال اجرا…
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              className="admin-btn-secondary inline-flex items-center gap-1.5"
              onClick={() => setTestOpen(true)}
            >
              <ScienceOutlinedIcon sx={{ fontSize: 18 }} />
              تست
            </button>
            <button
              type="button"
              className="admin-btn-primary inline-flex items-center gap-1.5"
              onClick={runNow}
              disabled={busy || scheduler?.sync_in_progress}
            >
              <SyncOutlinedIcon sx={{ fontSize: 18 }} />
              اجرای اکنون
            </button>
          </div>
        </div>

        {testOpen ? <KcoStockTestModal onClose={() => setTestOpen(false)} /> : null}

        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/70 flex flex-col lg:flex-row lg:items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-800">همگام‌سازی خودکار</span>
            <button
              type="button"
              role="switch"
              aria-checked={autoEnabled}
              aria-label={autoEnabled ? "خاموش کردن همگام‌سازی خودکار" : "روشن کردن همگام‌سازی خودکار"}
              disabled={busy}
              onClick={() => setAutoEnabled((v) => !v)}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 disabled:opacity-50 ${
                autoEnabled ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoEnabled ? "ms-6" : "ms-0.5"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">فاصله:</span>
            <input
              type="number"
              min={5}
              max={1440}
              className="admin-input w-24 dir-ltr"
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(e.target.value)}
              disabled={busy}
            />
            <span className="text-sm text-gray-600">دقیقه (حداقل ۵)</span>
          </div>
          <button
            type="button"
            className="admin-btn-accent lg:mr-auto"
            onClick={saveSchedulerSettings}
            disabled={busy}
          >
            ذخیره تنظیمات کرون
          </button>
        </div>

        <div className="admin-table-wrap border-0 rounded-none shadow-none">
          <table className="admin-table">
            <thead>
              <tr>
                <th>زمان</th>
                <th className="w-24">وضعیت</th>
                <th className="w-28">به‌روز شده</th>
                <th className="w-28">بدون تغییر</th>
                <th className="w-20">انبار فعال</th>
                <th>انبارهای منبع موجودی</th>
                <th>مدت</th>
                <th>پیام</th>
              </tr>
            </thead>
            <tbody>
              {!rows.length ? (
                <tr>
                  <td colSpan={8} className="text-center text-sm text-gray-500 py-8">
                    هنوز لاگی ثبت نشده است.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-sm">{formatDateTime(row.createdAt)}</td>
                    <td>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          row.status === "success"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {row.status === "success" ? "موفق" : "ناموفق"}
                      </span>
                    </td>
                    <td>{fa(row.products_updated)}</td>
                    <td>{fa(row.products_unchanged)}</td>
                    <td>{fa(row.active_warehouse_count)}</td>
                    <td
                      className="text-xs text-gray-700 max-w-[320px]"
                      title={row.warehouse_sources_summary || ""}
                    >
                      {row.warehouse_sources_summary || "—"}
                    </td>
                    <td>{row.duration_ms != null ? `${fa(Math.round(row.duration_ms / 1000))} ثانیه` : "—"}</td>
                    <td className="text-xs text-gray-600 max-w-[240px] truncate" title={row.error_message || ""}>
                      {row.error_message || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <button
              type="button"
              className="admin-btn-secondary text-sm"
              disabled={page <= 1 || busy}
              onClick={() => load(page - 1)}
            >
              قبلی
            </button>
            <span className="text-sm text-gray-600 self-center">
              صفحه {fa(page)} از {fa(pages)}
            </span>
            <button
              type="button"
              className="admin-btn-secondary text-sm"
              disabled={page >= pages || busy}
              onClick={() => load(page + 1)}
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default KcoStockSyncLogs;