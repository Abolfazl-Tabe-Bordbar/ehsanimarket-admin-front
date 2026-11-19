"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getSupportAgents, getTicketCategories, getTickets } from "@/funcs/support";
import {
  PRIORITY_OPTIONS,
  PriorityBadge,
  StatusBadge,
  fa,
  faId,
  formatDateTime,
} from "./supportHelpers";

const STATUS_TABS = [
  { value: "active", label: "باز" },
  { value: "open", label: "ثبت‌شده" },
  { value: "in_progress", label: "در حال بررسی" },
  { value: "waiting_customer", label: "منتظر مشتری" },
  { value: "resolved", label: "حل‌شده" },
  { value: "", label: "همه" },
];

function TicketsMain({ initialAssigned = "", initialUnread = false }) {
  const [filters, setFilters] = useState({ status: "active", assigned: initialAssigned ? String(initialAssigned) : "", priority: "", category_id: "", q: "", unread: initialUnread ? "1" : "", page: 1 });
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);

  const load = useCallback(() => {
    getTickets(filters).then((res) => setData(res?.status ? res : { body: [], count: 0, pageSize: 20, error: res?.message }));
  }, [filters]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60 * 1000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    getSupportAgents().then((res) => res?.status && setAgents(res.body));
    getTicketCategories().then((res) => res?.status && setCategories(res.body));
  }, []);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  const pages = data ? Math.max(1, Math.ceil((data.count || 0) / (data.pageSize || 20))) : 1;

  return (
    <section className="admin-section space-y-4">
      <div className="admin-card space-y-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value || "all"}
              type="button"
              onClick={() => setFilter("status", tab.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filters.status === tab.value
                  ? "bg-brand-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <form
            className="relative lg:col-span-2"
            onSubmit={(e) => {
              e.preventDefault();
              setFilter("q", search.trim());
            }}
          >
            <SearchIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            <input
              className="admin-input pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="شماره تیکت، شماره سفارش، موبایل یا عنوان + Enter"
            />
          </form>
          <select className="admin-input" value={filters.assigned} onChange={(e) => setFilter("assigned", e.target.value)}>
            <option value="">همه کارشناس‌ها</option>
            <option value="me">ارجاع‌شده به من</option>
            <option value="none">بدون کارشناس</option>
            {data?.isManager &&
              agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
          </select>
          <select className="admin-input" value={filters.category_id} onChange={(e) => setFilter("category_id", e.target.value)}>
            <option value="">همه موضوعات</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <select className="admin-input" value={filters.priority} onChange={(e) => setFilter("priority", e.target.value)}>
            <option value="">همه اولویت‌ها</option>
            {PRIORITY_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={filters.unread === "1"}
              onChange={(e) => setFilter("unread", e.target.checked ? "1" : "")}
            />
            فقط پیام‌های پاسخ‌داده‌نشده
          </label>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{data ? `${fa(data.count)} تیکت` : ""}</span>
            <button type="button" onClick={load} className="inline-flex items-center gap-1 hover:text-brand-navy">
              <RefreshIcon sx={{ fontSize: 16 }} />
              به‌روزرسانی
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        {data === null ? (
          <p className="p-10 text-center text-sm text-gray-400">در حال بارگذاری...</p>
        ) : data.error ? (
          <p className="p-10 text-center text-sm text-red-500">{data.error}</p>
        ) : !data.body.length ? (
          <p className="p-10 text-center text-sm text-gray-400">تیکتی با این فیلتر وجود ندارد</p>
        ) : (
          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">شماره</th>
                  <th>عنوان</th>
                  <th>مشتری</th>
                  <th>موضوع</th>
                  <th>اولویت</th>
                  <th>وضعیت</th>
                  <th>کارشناس</th>
                  <th>آخرین پیام</th>
                </tr>
              </thead>
              <tbody>
                {data.body.map((ticket) => (
                  <tr key={ticket.id} className={ticket.staff_unread ? "bg-amber-50/40" : undefined}>
                    <td className="text-xs text-gray-500">{faId(ticket.id)}</td>
                    <td className="max-w-[260px]">
                      <Link href={`/p-admin/tickets/${ticket.id}`} className="flex items-center gap-2 font-medium text-brand-navy hover:underline">
                        {ticket.staff_unread && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" title="پیام جدید مشتری" />}
                        <span className="truncate">{ticket.subject}</span>
                      </Link>
                      {ticket.orderId && <p className="mt-0.5 text-[11px] text-gray-400">سفارش {faId(ticket.orderId)}</p>}
                    </td>
                    <td className="whitespace-nowrap text-xs">
                      {ticket.user?.name || "—"}
                      <p className="text-gray-400" dir="ltr">{ticket.user?.phone_number}</p>
                    </td>
                    <td className="whitespace-nowrap text-xs">{ticket.category?.title || "—"}</td>
                    <td><PriorityBadge priority={ticket.priority} /></td>
                    <td><StatusBadge status={ticket.status} /></td>
                    <td className="whitespace-nowrap text-xs">{ticket.assignee?.name || <span className="text-gray-400">بدون کارشناس</span>}</td>
                    <td className="whitespace-nowrap text-xs text-gray-500">{formatDateTime(ticket.last_message_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <button
            type="button"
            className="admin-btn-secondary !py-1.5"
            disabled={filters.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            قبلی
          </button>
          <span className="text-gray-500">
            صفحه {fa(filters.page)} از {fa(pages)}
          </span>
          <button
            type="button"
            className="admin-btn-secondary !py-1.5"
            disabled={filters.page >= pages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            بعدی
          </button>
        </div>
      )}
    </section>
  );
}

export default TicketsMain;
