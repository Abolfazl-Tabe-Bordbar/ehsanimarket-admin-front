"use client";

import { useCallback, useEffect, useState } from "react";
import Loader from "@/components/modules/Loader";
import { getKcoStockSyncLogs, runKcoStockSyncNow } from "@/funcs/kco";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";

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

  const load = useCallback(async (p = 1) => {
    setBusy(true);
    const res = await getKcoStockSyncLogs(p);
    setBusy(false);
    if (res?.status) {
      setRows(res.body || []);
      setPage(res.pagination?.page || p);
      setPages(res.pagination?.pages || 1);
      if (res.scheduler) setScheduler(res.scheduler);
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
            <p className="text-xs text-gray-500 mt-1">
              {scheduler?.cron_enabled && scheduler?.scheduler_active ? (
                <>
                  هر {fa(scheduler.interval_minutes)} دقیقه به‌صورت خودکار موجودی از کارآمد خوانده می‌شود.
                </>
              ) : (
                <>
                  اجرای خودکار غیرفعال است؛ فقط با دکمه «اجرای اکنون» یا فعال‌کردن{" "}
                  <span className="dir-ltr">KCO_STOCK_SYNC_ENABLED</span> در سرور.
                </>
              )}{" "}
              کد انبار = شناسه <span className="dir-ltr">StoreRef</span> در کارآمد.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary inline-flex items-center gap-1.5 shrink-0"
            onClick={runNow}
            disabled={busy || scheduler?.sync_in_progress}
          >
            <SyncOutlinedIcon sx={{ fontSize: 18 }} />
            اجرای اکنون
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