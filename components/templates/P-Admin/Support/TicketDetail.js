"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StarIcon from "@mui/icons-material/Star";
import Loader from "@/components/modules/Loader";
import { TopRightToast } from "@/components/modules/Toast";
import { adminTicketFileUrl, getAdminTicket, replyAdminTicket, updateTicket } from "@/funcs/support";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  PriorityBadge,
  StatusBadge,
  fa,
  faId,
  formatDateTime,
  formatDuration,
} from "./supportHelpers";

const MAX_FILES = 3;
const MAX_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
const ORDER_STATUS = { 0: "در انتظار پرداخت", 1: "پرداخت‌شده", 2: "لغوشده" };

function Attachments({ ticketId, files = [], dark }) {
  if (!files.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {files.map((name) =>
        /\.(jpe?g|png|webp)$/i.test(name) ? (
          <a key={name} href={adminTicketFileUrl(ticketId, name)} target="_blank" rel="noopener noreferrer">
            <img src={adminTicketFileUrl(ticketId, name)} alt="پیوست" className="h-20 w-20 rounded-lg border border-gray-200 bg-white object-cover" />
          </a>
        ) : (
          <a
            key={name}
            href={adminTicketFileUrl(ticketId, name)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs ${dark ? "bg-white/15 text-white" : "border border-gray-200 bg-white text-gray-700"}`}
          >
            <PictureAsPdfOutlinedIcon sx={{ fontSize: 16 }} />
            فایل PDF
          </a>
        )
      )}
    </div>
  );
}

function SideBox({ title, children }) {
  return (
    <div className="admin-card space-y-3">
      <h3 className="text-sm font-bold text-brand-navy">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="text-left text-gray-800">{children}</span>
    </div>
  );
}

function TicketDetail({ ticketId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [isInternal, setIsInternal] = useState(false);
  const [nextStatus, setNextStatus] = useState("waiting_customer");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  const load = useCallback(() => {
    getAdminTicket(ticketId).then((res) => {
      if (res?.status) setData(res.body);
      else setError(res?.message || "تیکت یافت نشد");
    });
  }, [ticketId]);

  useEffect(load, [load]);
  useEffect(() => {
    if (data) bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [data]);

  const change = async (payload) => {
    setBusy(true);
    const res = await updateTicket(ticketId, payload);
    setBusy(false);
    if (res?.status) load();
  };

  const addFiles = (list) => {
    const next = [...files];
    for (const file of list) {
      if (next.length >= MAX_FILES) break;
      if (!ACCEPT.split(",").includes(file.type) || file.size > MAX_MB * 1024 * 1024) {
        TopRightToast.fire({ icon: "error", title: `فقط تصویر یا pdf تا ${MAX_MB} مگابایت` });
        continue;
      }
      next.push(file);
    }
    setFiles(next);
  };

  const send = async (event) => {
    event.preventDefault();
    if (!body.trim() && !files.length) return;
    const formData = new FormData();
    formData.append("body", body.trim());
    formData.append("is_internal", isInternal ? "true" : "false");
    if (!isInternal) formData.append("next_status", nextStatus);
    files.forEach((file) => formData.append("files", file));
    setBusy(true);
    const res = await replyAdminTicket(ticketId, formData);
    setBusy(false);
    if (!res?.status) return;
    setBody("");
    setFiles([]);
    setIsInternal(false);
    load();
  };

  if (error) {
    return (
      <div className="admin-card text-center text-sm text-gray-500">
        {error}
        <Link href="/p-admin/tickets" className="mt-3 block text-brand-navy">بازگشت به تیکت‌ها</Link>
      </div>
    );
  }
  if (!data) return <p className="p-10 text-center text-sm text-gray-400">در حال بارگذاری...</p>;

  const { ticket, messages, order, previousTickets, agents, cannedReplies, isManager, currentAdminId } = data;
  const firstResponse = ticket.first_response_at
    ? (new Date(ticket.first_response_at) - new Date(ticket.createdAt)) / 60000
    : null;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      {busy && <Loader />}

      <div className="space-y-4 min-w-0">
        <div className="admin-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">تیکت {faId(ticket.id)} — {ticket.category?.title || "بدون موضوع"}</p>
              <h2 className="mt-1 text-base font-bold text-gray-900">{ticket.subject}</h2>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>

        <div className="admin-card space-y-4 bg-gray-50/60">
          {messages.map((message) => {
            if (message.sender_type === "system") {
              return (
                <p key={message.id} className="text-center text-[11px] text-gray-400">
                  {message.is_internal && <LockOutlinedIcon sx={{ fontSize: 12 }} className="ml-1" />}
                  {message.body} — {formatDateTime(message.createdAt)}
                </p>
              );
            }
            const fromUser = message.sender_type === "user";
            return (
              <div key={message.id} className={`flex ${fromUser ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[75%] ${
                    message.is_internal
                      ? "border border-dashed border-amber-300 bg-amber-50"
                      : fromUser
                        ? "rounded-tr-sm border border-gray-100 bg-white"
                        : "rounded-tl-sm bg-brand-navy text-white"
                  }`}
                >
                  <p className={`mb-1 flex items-center gap-1 text-[11px] font-bold ${message.is_internal ? "text-amber-700" : fromUser ? "text-[#CA8549]" : "text-white/70"}`}>
                    {message.is_internal && <LockOutlinedIcon sx={{ fontSize: 12 }} />}
                    {message.sender_label}
                    {message.is_internal && " — یادداشت داخلی (مشتری نمی‌بیند)"}
                  </p>
                  {message.body && <p className="whitespace-pre-wrap text-sm leading-7">{message.body}</p>}
                  <Attachments ticketId={ticket.id} files={message.attachments} dark={!fromUser && !message.is_internal} />
                  <p className={`mt-1 text-[10px] ${!fromUser && !message.is_internal ? "text-white/60" : "text-gray-400"}`}>
                    {formatDateTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="admin-card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex rounded-xl bg-gray-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => setIsInternal(false)}
                className={`rounded-lg px-3 py-1.5 ${!isInternal ? "bg-white font-bold text-brand-navy shadow-sm" : "text-gray-500"}`}
              >
                پاسخ به مشتری
              </button>
              <button
                type="button"
                onClick={() => setIsInternal(true)}
                className={`rounded-lg px-3 py-1.5 ${isInternal ? "bg-white font-bold text-amber-700 shadow-sm" : "text-gray-500"}`}
              >
                یادداشت داخلی
              </button>
            </div>
            {cannedReplies.length > 0 && !isInternal && (
              <select
                className="admin-input !w-auto !py-1.5 text-xs"
                value=""
                onChange={(e) => {
                  const reply = cannedReplies.find((item) => String(item.id) === e.target.value);
                  if (reply) setBody((prev) => (prev ? `${prev}\n${reply.body}` : reply.body));
                }}
              >
                <option value="">درج پاسخ آماده...</option>
                {cannedReplies.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            )}
          </div>

          <textarea
            rows={5}
            maxLength={3000}
            className={`admin-input !rounded-xl ${isInternal ? "!border-amber-300 !bg-amber-50/50" : ""}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={isInternal ? "یادداشت برای همکاران (مشتری نمی‌بیند)" : "پاسخ به مشتری..."}
          />

          <input
            ref={fileRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              addFiles(Array.from(e.target.files || []));
              e.target.value = "";
            }}
          />
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <span key={`${file.name}-${index}`} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs">
                  <span className="max-w-[160px] truncate" dir="ltr">{file.name}</span>
                  <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} aria-label="حذف">
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={files.length >= MAX_FILES}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-brand-navy disabled:opacity-50"
            >
              <AttachFileIcon sx={{ fontSize: 16 }} />
              پیوست (حداکثر {fa(MAX_FILES)} فایل)
            </button>
            <div className="flex flex-wrap items-center gap-2">
              {!isInternal && (
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  وضعیت بعد از ارسال:
                  <select className="admin-input !w-auto !py-1.5 text-xs" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
                    {STATUS_OPTIONS.filter((item) => item.value !== "open").map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </label>
              )}
              <button type="submit" className={isInternal ? "admin-btn-secondary" : "admin-btn-primary"} disabled={!body.trim() && !files.length}>
                {isInternal ? "ثبت یادداشت" : "ارسال پاسخ"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <SideBox title="مدیریت تیکت">
          <label className="block space-y-1 text-xs text-gray-600">
            وضعیت
            <select className="admin-input" value={ticket.status} onChange={(e) => change({ status: e.target.value })}>
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-xs text-gray-600">
            اولویت
            <select className="admin-input" value={ticket.priority} onChange={(e) => change({ priority: e.target.value })}>
              {PRIORITY_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <div className="space-y-1 text-xs text-gray-600">
            کارشناس مسئول
            {isManager ? (
              <select
                className="admin-input"
                value={ticket.assigned_admin_id || ""}
                onChange={(e) => change({ assigned_admin_id: e.target.value || null })}
              >
                <option value="">بدون کارشناس</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}{agent.is_manager ? " (مدیر)" : ""}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 px-3 py-2">
                <span className="text-gray-800">{ticket.assignee?.name || "بدون کارشناس"}</span>
                {!ticket.assigned_admin_id && (
                  <button type="button" className="text-brand-navy hover:underline" onClick={() => change({ assigned_admin_id: currentAdminId })}>
                    برداشتن تیکت
                  </button>
                )}
              </div>
            )}
          </div>
        </SideBox>

        <SideBox title="مشتری">
          <Row label="نام">{ticket.user?.name || "—"}</Row>
          <Row label="موبایل"><span dir="ltr">{ticket.user?.phone_number || "—"}</span></Row>
          {ticket.user?.id && (
            <Link href={`/p-admin/users/${ticket.user.id}`} className="block text-xs text-brand-navy hover:underline">
              مشاهده پرونده کاربر
            </Link>
          )}
        </SideBox>

        {order && (
          <SideBox title={`سفارش ${faId(order.id)}`}>
            <Row label="مبلغ">{fa(order.total_price)} تومان</Row>
            <Row label="وضعیت">{ORDER_STATUS[order.status] || "—"}</Row>
            <Row label="تاریخ">{formatDateTime(order.createdAt)}</Row>
          </SideBox>
        )}

        <SideBox title="زمان‌ها">
          <Row label="ثبت">{formatDateTime(ticket.createdAt)}</Row>
          <Row label="اولین پاسخ">{firstResponse === null ? "هنوز پاسخ داده نشده" : formatDuration(firstResponse)}</Row>
          {ticket.resolved_at && <Row label="حل‌شده">{formatDateTime(ticket.resolved_at)}{ticket.closed_automatically ? " (خودکار)" : ""}</Row>}
          {ticket.rating && (
            <Row label="رضایت مشتری">
              <span className="inline-flex items-center gap-0.5 text-[#e0a100]">
                {fa(ticket.rating)} <StarIcon sx={{ fontSize: 14 }} />
              </span>
              {ticket.rating_comment && <span className="mt-1 block text-gray-500">{ticket.rating_comment}</span>}
            </Row>
          )}
        </SideBox>

        <SideBox title="سوابق تیکت‌های این مشتری">
          {previousTickets.length ? (
            <ul className="space-y-2">
              {previousTickets.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 text-xs">
                  <Link href={`/p-admin/tickets/${item.id}`} className="truncate text-brand-navy hover:underline">
                    {faId(item.id)} — {item.subject}
                  </Link>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">تیکت دیگری ندارد</p>
          )}
        </SideBox>
      </div>
    </div>
  );
}

export default TicketDetail;
