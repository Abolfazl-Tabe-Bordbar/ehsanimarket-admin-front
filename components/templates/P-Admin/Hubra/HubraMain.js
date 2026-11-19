"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Loader from "@/components/modules/Loader";
import { TopRightToast } from "@/components/modules/Toast";
import { uploadUrl } from "@/data/variables";
import {
  getHubraAccount,
  getHubraBroadcast,
  getHubraBroadcasts,
  getHubraUsage,
  searchHubraProducts,
  sendHubraBroadcast,
} from "@/funcs/hubra";

const MESSAGE_MAX = 4000;
const MAX_FILES = 10;
const MAX_FILE_MB = 20;
const ACCEPT = ".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv,.pdf,.doc,.docx,.xls,.xlsx,.zip";
const PLATFORM_LABELS = { telegram: "تلگرام", bale: "بله", eitaa: "ایتا", rubika: "روبیکا", soroush: "سروش", whatsapp: "واتساپ", instagram: "اینستاگرام" };
const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  sent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partial: "bg-orange-50 text-orange-700 border-orange-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};
const fa = (value) => Number(value || 0).toLocaleString("fa-IR");

function StatusBadge({ status }) {
  if (!status) return null;
  const key = status.key || status;
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[key] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status.label || key}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fa-IR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

// متن پیام برای پیش‌نمایش (حذف تگ‌های html)
const plain = (value) => String(value || "").replace(/<[^>]+>/g, "").trim();

function UsageBox({ usage }) {
  if (!usage) return null;
  const today = usage.today || {};
  const used = today.used ?? today.count ?? today.sent ?? null;
  const limit = usage.limits?.daily ?? usage.plan?.daily_limit ?? usage.limit ?? null;
  const remaining = today.remaining ?? (limit !== null && used !== null ? Math.max(0, limit - used) : null);
  return (
    <div className="admin-card space-y-2 text-sm">
      <h3 className="text-sm font-bold text-brand-navy">سهمیه امروز</h3>
      {usage.plan?.name && <p className="text-xs text-gray-500">پلن: {usage.plan.name}</p>}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-[11px] text-gray-500">مصرف‌شده</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{used === null ? "—" : fa(used)}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-[11px] text-gray-500">باقی‌مانده</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{remaining === null ? "—" : fa(remaining)}</p>
        </div>
      </div>
      <p className="text-[11px] leading-5 text-gray-400">هر کانال در هر ارسال یک واحد از سهمیه روزانه مصرف می‌کند.</p>
    </div>
  );
}

function HistoryRow({ item }) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      const res = await getHubraBroadcast(item.ulid);
      setDetail(res?.status ? res.body : { error: res?.message });
    }
  };

  const targets = detail?.targets || item.targets || [];
  return (
    <>
      <tr className="cursor-pointer hover:bg-gray-50" onClick={toggle}>
        <td className="whitespace-nowrap text-xs text-gray-500">{formatDate(item.created_at || item.createdAt)}</td>
        <td><StatusBadge status={detail?.status || item.status} /></td>
        <td className="min-w-[220px] max-w-[320px]">
          <p className="line-clamp-2 text-sm text-gray-700">{plain(item.message || item.text) || "(فقط فایل)"}</p>
        </td>
        <td className="whitespace-nowrap text-xs">{fa(targets.length || item.channels_count)} کانال</td>
        <td className="whitespace-nowrap text-xs text-gray-500">{item.sent_by || "—"}</td>
      </tr>
      {open && (
        <tr>
          <td colSpan={5} className="bg-gray-50/70">
            {!detail ? (
              <p className="text-xs text-gray-400">در حال دریافت...</p>
            ) : detail.error ? (
              <p className="text-xs text-red-500">{detail.error}</p>
            ) : (
              <ul className="space-y-1.5">
                {targets.map((target, index) => (
                  <li key={target.channel?.ulid || index} className="flex flex-wrap items-center gap-2 text-xs">
                    <StatusBadge status={target.status} />
                    <span className="text-gray-700">{target.channel?.name || target.channel_name || "کانال"}</span>
                    {target.channel?.platform && (
                      <span className="text-gray-400">({PLATFORM_LABELS[target.channel.platform] || target.channel.platform})</span>
                    )}
                    {target.error && <span className="text-red-600">— {target.error}</span>}
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function HubraMain() {
  const [account, setAccount] = useState(null);
  const [usage, setUsage] = useState(null);
  const [history, setHistory] = useState(null);
  const [workspaceId, setWorkspaceId] = useState("");
  const [channelIds, setChannelIds] = useState([]);
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState("html");
  const [files, setFiles] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [product, setProduct] = useState(null);
  const [attachProductImage, setAttachProductImage] = useState(true);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const loadAccount = useCallback((refresh = false) => {
    getHubraAccount(refresh).then((res) => {
      setAccount(res?.status ? res.body : { error: res?.message || "اتصال به هابرا برقرار نشد" });
      const workspaces = res?.body?.workspaces || [];
      if (workspaces.length) setWorkspaceId((current) => current || workspaces[0].ulid);
    });
  }, []);

  const loadHistory = useCallback(() => {
    getHubraBroadcasts(1).then((res) => setHistory(res?.status ? res.body : []));
    getHubraUsage().then((res) => res?.status && setUsage(res.body));
  }, []);

  useEffect(() => {
    loadAccount();
    loadHistory();
  }, [loadAccount, loadHistory]);

  useEffect(() => {
    const q = productQuery.trim();
    if (q.length < 2) {
      setProductResults([]);
      return;
    }
    const timer = setTimeout(() => searchHubraProducts(q).then((res) => setProductResults(res?.body || [])), 350);
    return () => clearTimeout(timer);
  }, [productQuery]);

  const workspace = (account?.workspaces || []).find((ws) => ws.ulid === workspaceId);
  const channels = workspace?.channels || [];
  const productImageCount = product && attachProductImage && product.image ? 1 : 0;

  const toggleChannel = (id) =>
    setChannelIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const pickProduct = (item) => {
    setProduct(item);
    setFormat("html");
    setMessage(item.caption);
    setProductQuery("");
    setProductResults([]);
  };

  const addFiles = (list) => {
    const next = [...files];
    for (const file of list) {
      if (next.length + productImageCount >= MAX_FILES) {
        TopRightToast.fire({ icon: "warning", title: `حداکثر ${fa(MAX_FILES)} فایل` });
        break;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        TopRightToast.fire({ icon: "error", title: `حجم «${file.name}» بیشتر از ${fa(MAX_FILE_MB)} مگابایت است` });
        continue;
      }
      next.push(file);
    }
    setFiles(next);
  };

  // وضعیت ارسال جدید چند بار بررسی می‌شود تا نتیجه نهایی در تاریخچه دیده شود
  const pollStatus = (ulid, attempt = 0) => {
    if (!ulid || attempt > 6) return loadHistory();
    setTimeout(async () => {
      const res = await getHubraBroadcast(ulid);
      if (res?.status && res.body?.status?.key && res.body.status.key !== "pending") return loadHistory();
      pollStatus(ulid, attempt + 1);
    }, 5000);
  };

  const send = async () => {
    if (!channelIds.length) return TopRightToast.fire({ icon: "warning", title: "حداقل یک کانال را انتخاب کنید" });
    if (!message.trim() && !files.length && !productImageCount) {
      return TopRightToast.fire({ icon: "warning", title: "متن پیام یا فایل لازم است" });
    }
    const formData = new FormData();
    formData.append("workspace_id", workspaceId);
    channelIds.forEach((id) => formData.append("channel_ids[]", id));
    formData.append("message", message.trim());
    formData.append("format", format);
    if (product) {
      formData.append("product_id", String(product.id));
      formData.append("attach_product_image", attachProductImage ? "true" : "false");
    }
    files.forEach((file) => formData.append("attachments", file));

    setBusy(true);
    const res = await sendHubraBroadcast(formData);
    setBusy(false);
    if (!res?.status) return;
    setMessage("");
    setFiles([]);
    setProduct(null);
    loadHistory();
    pollStatus(res.body?.ulid);
  };

  if (account?.error) {
    return (
      <div className="admin-card space-y-3 text-center">
        <p className="text-sm text-red-500">{account.error}</p>
        <Link href="/p-admin/site-settings#hubra" className="inline-block text-sm font-medium text-brand-navy hover:underline">
          ثبت یا بررسی توکن هابرا در تنظیمات سایت
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      {busy && <Loader />}

      <div className="min-w-0 space-y-4">
        <section className="admin-card space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-brand-navy">کانال‌ها</h3>
            <button type="button" onClick={() => loadAccount(true)} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-navy">
              <RefreshIcon sx={{ fontSize: 16 }} />
              به‌روزرسانی لیست
            </button>
          </div>

          {account === null ? (
            <p className="text-xs text-gray-400">در حال دریافت کانال‌ها...</p>
          ) : (
            <>
              {(account.workspaces || []).length > 1 && (
                <select
                  className="admin-input"
                  value={workspaceId}
                  onChange={(e) => {
                    setWorkspaceId(e.target.value);
                    setChannelIds([]);
                  }}
                >
                  {account.workspaces.map((ws) => (
                    <option key={ws.ulid} value={ws.ulid}>{ws.name || ws.ulid}</option>
                  ))}
                </select>
              )}
              {!channels.length ? (
                <p className="text-xs text-amber-700">در این فضای کاری کانال فعالی وجود ندارد؛ کانال‌ها را در پنل هابرا متصل کنید.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setChannelIds(channelIds.length === channels.length ? [] : channels.map((ch) => ch.ulid))}
                    className="rounded-xl border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    {channelIds.length === channels.length ? "حذف انتخاب همه" : "انتخاب همه"}
                  </button>
                  {channels.map((channel) => {
                    const selected = channelIds.includes(channel.ulid);
                    return (
                      <button
                        key={channel.ulid}
                        type="button"
                        onClick={() => toggleChannel(channel.ulid)}
                        aria-pressed={selected}
                        className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                          selected ? "border-brand-navy bg-brand-navy text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {channel.name || channel.title || channel.ulid}
                        {channel.platform && (
                          <span className={`mr-1.5 ${selected ? "text-white/70" : "text-gray-400"}`}>
                            ({PLATFORM_LABELS[channel.platform] || channel.platform})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        <section className="admin-card space-y-4">
          <h3 className="text-sm font-bold text-brand-navy">معرفی محصول (اختیاری)</h3>
          {product ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                {product.image && (
                  <img src={`${uploadUrl}/products/${product.image}`} alt="" className="h-12 w-12 rounded-lg bg-white object-contain" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">{product.name}</p>
                  <label className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
                    <input type="checkbox" checked={attachProductImage} onChange={(e) => setAttachProductImage(e.target.checked)} disabled={!product.image} />
                    ارسال تصویر محصول همراه پیام
                  </label>
                </div>
              </div>
              <button type="button" onClick={() => setProduct(null)} className="text-xs text-red-500 hover:underline">
                حذف محصول
              </button>
            </div>
          ) : (
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
              <input
                className="admin-input pr-10"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="نام یا شناسه محصول را جستجو کنید تا متن معرفی خودکار ساخته شود"
              />
              {productResults.length > 0 && (
                <div className="absolute inset-x-0 top-full z-10 mt-1 max-h-64 overflow-auto rounded-xl border border-gray-100 bg-white shadow-lg">
                  {productResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pickProduct(item)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-right hover:bg-gray-50"
                    >
                      {item.image && <img src={`${uploadUrl}/products/${item.image}`} alt="" className="h-9 w-9 rounded-lg bg-gray-50 object-contain" />}
                      <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
                      <span className="text-xs text-gray-400">{fa(Number(item.totalPrice) > 0 ? item.totalPrice : item.price)} تومان</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="admin-card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-brand-navy">متن پیام</h3>
            <div className="flex rounded-xl bg-gray-100 p-1 text-xs">
              {[
                { value: "html", label: "با قالب‌بندی" },
                { value: "text", label: "متن ساده" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFormat(item.value)}
                  className={`rounded-lg px-3 py-1.5 ${format === item.value ? "bg-white font-bold text-brand-navy shadow-sm" : "text-gray-500"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={9}
            maxLength={MESSAGE_MAX}
            className="admin-input !rounded-xl"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="متن پیام برای کانال‌ها..."
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
            <span>
              {format === "html"
                ? "تگ‌های مجاز: <b> <i> <u> <s> <code> <blockquote> <a href> <br> — در پیام‌رسان‌هایی که پشتیبانی نمی‌کنند متن ساده ارسال می‌شود."
                : "متن همان‌طور که نوشته شده ارسال می‌شود."}
            </span>
            <span>{fa(message.length)} / {fa(MESSAGE_MAX)}</span>
          </div>

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
                  <span className="max-w-[180px] truncate" dir="ltr">{file.name}</span>
                  <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} aria-label="حذف">
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-brand-navy"
            >
              <AttachFileIcon sx={{ fontSize: 16 }} />
              پیوست فایل (تصویر، ویدیو، pdf، اکسل — حداکثر {fa(MAX_FILES)} فایل، هر کدام {fa(MAX_FILE_MB)} مگابایت)
            </button>
            <button type="button" onClick={send} className="admin-btn-primary inline-flex items-center gap-1.5" disabled={!channelIds.length}>
              <SendOutlinedIcon sx={{ fontSize: 18 }} className="rotate-180" />
              ارسال به {fa(channelIds.length)} کانال
            </button>
          </div>
        </section>

        <section className="admin-card !p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h3 className="text-sm font-bold text-brand-navy">ارسال‌های اخیر</h3>
            <button type="button" onClick={loadHistory} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-navy">
              <RefreshIcon sx={{ fontSize: 16 }} />
              به‌روزرسانی
            </button>
          </div>
          {history === null ? (
            <p className="p-8 text-center text-xs text-gray-400">در حال بارگذاری...</p>
          ) : !history.length ? (
            <p className="p-8 text-center text-xs text-gray-400">هنوز پیامی ارسال نشده است</p>
          ) : (
            <div className="admin-table-wrap border-0 rounded-none shadow-none">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>زمان</th>
                    <th>وضعیت</th>
                    <th>پیام</th>
                    <th>کانال‌ها</th>
                    <th>ارسال‌کننده</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <HistoryRow key={item.ulid} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <div className="space-y-4">
        <UsageBox usage={usage} />
        <div className="admin-card space-y-2 text-xs leading-6 text-gray-500">
          <h3 className="text-sm font-bold text-brand-navy">راهنما</h3>
          <p>ارسال در پس‌زمینه انجام می‌شود؛ وضعیت هر کانال را با کلیک روی ردیف تاریخچه ببینید.</p>
          <p>اگر کانالی در لیست نیست، آن را در پنل هابرا متصل یا فعال کنید و «به‌روزرسانی لیست» را بزنید.</p>
          <Link href="/p-admin/site-settings#hubra" className="text-brand-navy hover:underline">تنظیم توکن هابرا</Link>
        </div>
      </div>
    </div>
  );
}

export default HubraMain;
