"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import StarIcon from "@mui/icons-material/Star";
import { getSupportAgents } from "@/funcs/support";
import { fa, formatDuration } from "./supportHelpers";

function SupportAgents() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSupportAgents().then((res) => setData(res?.status ? res : { body: [], error: res?.message }));
  }, []);

  return (
    <section className="admin-section space-y-4">
      <div className="admin-card space-y-2 text-sm leading-7 text-gray-600">
        <p>
          کاربر پشتیبانی همان مدیر پنل است که دسترسی پشتیبانی دارد. برای افزودن، در بخش{" "}
          <Link href="/p-admin/admins" className="font-bold text-brand-navy hover:underline">ادمین‌ها</Link>{" "}
          یک مدیر بسازید و فقط یکی از این دسترسی‌ها را به او بدهید:
        </p>
        <ul className="list-disc space-y-1 pr-5 text-xs">
          <li><b>پاسخ به تیکت‌های پشتیبانی:</b> فقط تیکت‌های ارجاع‌شده به خودش و تیکت‌های بدون کارشناس را می‌بیند و جواب می‌دهد.</li>
          <li><b>مدیریت پشتیبانی:</b> همه تیکت‌ها، ارجاع به کارشناس‌ها، موضوعات، پاسخ‌های آماده و گزارش‌ها.</li>
        </ul>
        <p className="text-xs text-gray-500">مدیری که فقط دسترسی پشتیبانی دارد، در پنل فقط منوی پشتیبانی را می‌بیند.</p>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy">
              <SupportAgentOutlinedIcon />
            </span>
            <div>
              <h3 className="text-base font-semibold text-brand-navy">کاربران پشتیبانی</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {data ? `${fa(data.body.length)} کارشناس — ${fa(data.unassigned)} تیکت باز بدون کارشناس` : ""}
              </p>
            </div>
          </div>
        </div>
        {data === null ? (
          <p className="p-10 text-center text-sm text-gray-400">در حال بارگذاری...</p>
        ) : data.error ? (
          <p className="p-10 text-center text-sm text-red-500">{data.error}</p>
        ) : !data.body.length ? (
          <p className="p-10 text-center text-sm text-gray-400">هنوز مدیری دسترسی پشتیبانی ندارد</p>
        ) : (
          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>نقش</th>
                  <th>تیکت باز</th>
                  <th>بسته‌شده</th>
                  <th>میانگین اولین پاسخ</th>
                  <th>رضایت</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.body.map((agent) => (
                  <tr key={agent.id}>
                    <td className="font-medium text-gray-800">
                      {agent.name}
                      <p className="text-[11px] text-gray-400" dir="ltr">{agent.username}</p>
                    </td>
                    <td>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${agent.is_manager ? "bg-brand-navy/10 text-brand-navy" : "bg-gray-100 text-gray-600"}`}>
                        {agent.is_manager ? "مدیر پشتیبانی" : "کارشناس"}
                      </span>
                    </td>
                    <td>{fa(agent.open)}</td>
                    <td>{fa(agent.resolved)}</td>
                    <td className="text-xs">{formatDuration(agent.avg_first_response_minutes)}</td>
                    <td className="text-xs">
                      {agent.avg_rating ? (
                        <span className="inline-flex items-center gap-0.5">{fa(agent.avg_rating)} <StarIcon sx={{ fontSize: 14 }} className="text-[#e0a100]" /></span>
                      ) : "—"}
                    </td>
                    <td>
                      <Link href={`/p-admin/tickets?assigned=${agent.id}`} className="text-xs text-brand-navy hover:underline">تیکت‌ها</Link>
                    </td>
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

export default SupportAgents;
