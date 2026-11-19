"use client";

import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { getSupportReports } from "@/funcs/support";
import { fa, formatDuration } from "./supportHelpers";

const RANGES = [
  { days: 7, label: "۷ روز اخیر" },
  { days: 30, label: "۳۰ روز اخیر" },
  { days: 90, label: "۹۰ روز اخیر" },
  { days: 365, label: "یک سال اخیر" },
];

function StatTile({ label, value, hint }) {
  return (
    <div className="admin-card">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

// نوار افقی تک‌رنگ برای مقایسه مقدارها (برچسب و عدد با رنگ متن، نه رنگ نوار)
function BarList({ title, rows, total }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <div className="admin-card space-y-3">
      <h3 className="text-sm font-bold text-brand-navy">{title}</h3>
      {!rows.length || !total ? (
        <p className="text-xs text-gray-400">داده‌ای در این بازه نیست</p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((row) => (
            <li key={row.label} title={`${row.label}: ${fa(row.count)} (${fa(Math.round((row.count / total) * 100))}٪)`}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-gray-700">{row.label}</span>
                <span className="text-gray-500">
                  {fa(row.count)} <span className="text-gray-400">({fa(Math.round((row.count / total) * 100))}٪)</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-brand-navy"
                  style={{ width: `${row.count ? Math.max(2, (row.count / max) * 100) : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SupportReports() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    getSupportReports({ from: from.toISOString(), to: to.toISOString() }).then((res) =>
      setData(res?.status ? res.body : { error: res?.message || "دریافت گزارش انجام نشد" })
    );
  }, [days]);

  return (
    <section className="admin-section space-y-4">
      <div className="flex flex-wrap gap-2">
        {RANGES.map((range) => (
          <button
            key={range.days}
            type="button"
            onClick={() => setDays(range.days)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${days === range.days ? "bg-brand-navy text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {data === null ? (
        <p className="p-10 text-center text-sm text-gray-400">در حال بارگذاری...</p>
      ) : data.error ? (
        <p className="admin-card text-center text-sm text-red-500">{data.error}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="تعداد تیکت‌ها" value={fa(data.total)} hint={`${fa(data.unanswered)} تیکت هنوز پاسخ نگرفته`} />
            <StatTile label="میانگین زمان اولین پاسخ" value={formatDuration(data.avg_first_response_minutes)} />
            <StatTile label="میانگین زمان حل" value={formatDuration(data.avg_resolution_minutes)} hint={`${fa(data.auto_closed)} تیکت خودکار بسته شد (در میانگین نیست)`} />
            <StatTile
              label="رضایت مشتریان"
              value={
                data.satisfaction.average ? (
                  <span className="inline-flex items-center gap-1">
                    {fa(data.satisfaction.average)} <span className="text-sm text-gray-400">از ۵</span>
                  </span>
                ) : "—"
              }
              hint={`${fa(data.satisfaction.count)} نظر ثبت‌شده`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BarList
              title="موضوعات پرتکرار"
              total={data.total}
              rows={data.by_category.map((row) => ({ label: row.title, count: row.count }))}
            />
            <BarList title="وضعیت تیکت‌ها" total={data.total} rows={data.by_status} />
            <BarList title="اولویت" total={data.total} rows={data.by_priority} />
            <BarList
              title="توزیع امتیاز رضایت"
              total={data.satisfaction.count}
              rows={[...data.satisfaction.distribution].reverse().map((row) => ({ label: `${fa(row.score)} ستاره`, count: row.count }))}
            />
          </div>

          <div className="admin-card !p-0 overflow-hidden">
            <h3 className="border-b border-gray-100 p-5 text-sm font-bold text-brand-navy">عملکرد کارشناس‌ها</h3>
            {!data.agents.length ? (
              <p className="p-8 text-center text-xs text-gray-400">کارشناسی تعریف نشده است</p>
            ) : (
              <div className="admin-table-wrap border-0 rounded-none shadow-none">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>کارشناس</th>
                      <th>تیکت‌ها</th>
                      <th>حل‌شده</th>
                      <th>میانگین اولین پاسخ</th>
                      <th>رضایت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.agents.map((agent) => (
                      <tr key={agent.id}>
                        <td className="font-medium text-gray-800">{agent.name}</td>
                        <td>{fa(agent.total)}</td>
                        <td>{fa(agent.resolved)}</td>
                        <td className="text-xs">{formatDuration(agent.avg_first_response_minutes)}</td>
                        <td className="text-xs">
                          {agent.avg_rating ? (
                            <span className="inline-flex items-center gap-0.5">{fa(agent.avg_rating)} <StarIcon sx={{ fontSize: 14 }} className="text-[#e0a100]" /></span>
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default SupportReports;
