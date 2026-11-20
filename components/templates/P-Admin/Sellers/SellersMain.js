"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import Loader from "@/components/modules/Loader";
import { createSeller, deleteSeller, getSellerOrders, getSellers, setSellerPassword, updateSeller } from "@/funcs/sellers";

const fa = (value) => Number(value || 0).toLocaleString("fa-IR");
const faId = (value) => Number(value || 0).toLocaleString("fa-IR", { useGrouping: false });
const toman = (value) => `${fa(value)} تومان`;

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const ORDER_STATES = {
  pending: { label: "در انتظار پرداخت", className: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { label: "پرداخت‌شده", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "لغو شده", className: "bg-gray-100 text-gray-500 border-gray-200" },
  expired: { label: "منقضی", className: "bg-red-50 text-red-600 border-red-200" },
};

const ICON_BTN =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50";

const EMPTY_FORM = { first_name: "", last_name: "", username: "", phone_number: "", password: "", is_active: true };

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-gray-600">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function SellerOrders({ seller, onClose }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setData(null);
    getSellerOrders(seller.id, page).then((res) => setData(res?.status ? res : { data: [], error: res?.message }));
  }, [seller.id, page]);

  return (
    <div className="admin-card !p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
        <div>
          <h3 className="text-base font-semibold text-brand-navy">
            سفارش‌های {seller.first_name} {seller.last_name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{data?.total !== undefined ? `${fa(data.total)} سفارش` : ""}</p>
        </div>
        <button type="button" className="admin-btn-secondary inline-flex items-center gap-1" onClick={onClose}>
          <CloseIcon sx={{ fontSize: 16 }} /> بستن
        </button>
      </div>
      {data === null ? (
        <p className="p-10 text-center text-sm text-gray-400">در حال بارگذاری...</p>
      ) : data.error ? (
        <p className="p-10 text-center text-sm text-red-500">{data.error}</p>
      ) : !data.data.length ? (
        <p className="p-10 text-center text-sm text-gray-400">این فروشنده هنوز سفارشی ثبت نکرده است</p>
      ) : (
        <>
          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table !min-w-[760px]">
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>مشتری</th>
                  <th>اقلام</th>
                  <th>مبلغ</th>
                  <th>وضعیت</th>
                  <th>ثبت</th>
                  <th>پرداخت</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((order) => {
                  const state = ORDER_STATES[order.state] || ORDER_STATES.pending;
                  return (
                    <tr key={order.id}>
                      <td className="font-medium">#{faId(order.id)}</td>
                      <td>
                        {order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : "—"}
                        <p className="text-[11px] text-gray-400" dir="ltr">{order.customer?.phone_number}</p>
                      </td>
                      <td>{fa(order.items_count)}</td>
                      <td className="whitespace-nowrap">{toman(order.total_price)}</td>
                      <td>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${state.className}`}>{state.label}</span>
                      </td>
                      <td className="text-xs">{formatDateTime(order.createdAt)}</td>
                      <td className="text-xs">{formatDateTime(order.paid_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(page > 1 || data.has_more) && (
            <div className="flex justify-center gap-2 border-t border-gray-100 p-3">
              <button type="button" className="admin-btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>قبلی</button>
              <span className="self-center text-xs text-gray-500">صفحه {fa(page)}</span>
              <button type="button" className="admin-btn-secondary" disabled={!data.has_more} onClick={() => setPage((p) => p + 1)}>بعدی</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SellersMain() {
  const [sellers, setSellers] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [ordersOf, setOrdersOf] = useState(null);

  const refresh = () =>
    getSellers().then((res) => {
      setError(res?.status ? "" : res?.message || "خطا در دریافت فروشندگان");
      setSellers(res?.status ? res.data : []);
    });

  useEffect(() => {
    refresh();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  };
  const openEdit = (seller) => {
    setEditing(seller);
    setForm({
      first_name: seller.first_name,
      last_name: seller.last_name,
      username: seller.username,
      phone_number: seller.phone_number || "",
      password: "",
      is_active: seller.is_active,
    });
  };
  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    const { password, ...profile } = form;
    const res = editing ? await updateSeller(editing.id, profile) : await createSeller({ ...profile, password });
    setBusy(false);
    if (res?.status) {
      setForm(null);
      setEditing(null);
      refresh();
    }
  };

  const changePassword = async (seller) => {
    const result = await Swal.fire({
      title: `رمز جدید ${seller.first_name} ${seller.last_name}`,
      input: "password",
      inputPlaceholder: "حداقل ۸ کاراکتر، حروف انگلیسی و عدد",
      inputAttributes: { dir: "ltr", autocomplete: "new-password" },
      text: "فروشنده از اپ خارج می‌شود و باید با رمز جدید وارد شود.",
      showCancelButton: true,
      confirmButtonText: "ذخیره رمز",
      cancelButtonText: "انصراف",
    });
    if (!result.isConfirmed || !result.value) return;
    setBusy(true);
    await setSellerPassword(seller.id, result.value);
    setBusy(false);
  };

  const toggleActive = async (seller) => {
    setBusy(true);
    const res = await updateSeller(seller.id, { is_active: !seller.is_active });
    setBusy(false);
    if (res?.status) refresh();
  };

  const remove = async (seller) => {
    const confirm = await Swal.fire({
      title: "حذف فروشنده",
      text: "اگر این فروشنده سفارش ثبت کرده باشد، حذف نمی‌شود و فقط غیرفعال می‌شود.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;
    setBusy(true);
    const res = await deleteSeller(seller.id);
    setBusy(false);
    if (res?.status) {
      if (ordersOf?.id === seller.id && !res.deactivated) setOrdersOf(null);
      refresh();
    }
  };

  return (
    <section className="admin-section space-y-4">
      {busy && <Loader />}

      <div className="admin-card flex gap-3 text-sm leading-7 text-gray-600">
        <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy">
          <PhoneIphoneOutlinedIcon />
        </span>
        <div>
          <p>
            فروشنده با <b>نام کاربری و رمز</b> وارد اپ فروشنده می‌شود، مشتری را با شماره موبایل پیدا یا ثبت‌نام می‌کند،
            سبد را می‌چیند و سفارش ثبت می‌کند. <b>لینک پرداخت با پیامک</b> برای مشتری می‌رود و سفارش پس از پرداخت مثل بقیه
            خریدها در بخش «خریدها» دیده می‌شود.
          </p>
          <p className="text-xs text-gray-500">
            موجودی محصولات با ثبت سفارش رزرو می‌شود و اگر مشتری تا ۲۴ ساعت پرداخت نکند، سفارش لغو و موجودی برمی‌گردد. متن
            پیامک در «مدیریت پیام‌ها ← لینک پرداخت سفارش فروشنده» قابل تغییر است.
          </p>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy">
              <StorefrontOutlinedIcon />
            </span>
            <div>
              <h3 className="text-base font-semibold text-brand-navy">فروشندگان</h3>
              <p className="mt-0.5 text-xs text-gray-500">{sellers ? `${fa(sellers.length)} فروشنده` : ""}</p>
            </div>
          </div>
          <button type="button" className="admin-btn-primary inline-flex items-center gap-1.5" onClick={form ? () => setForm(null) : openAdd}>
            {form ? <CloseIcon sx={{ fontSize: 18 }} /> : <AddOutlinedIcon sx={{ fontSize: 18 }} />}
            {form ? "بستن فرم" : "افزودن فروشنده"}
          </button>
        </div>

        {form && (
          <form onSubmit={submit} className="space-y-4 border-b border-gray-100 bg-gray-50/70 p-5">
            <h4 className="text-sm font-semibold text-brand-navy">{editing ? `ویرایش ${editing.first_name} ${editing.last_name}` : "فروشنده جدید"}</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="نام">
                <input className="admin-input" maxLength={32} value={form.first_name} onChange={setField("first_name")} required />
              </Field>
              <Field label="نام خانوادگی">
                <input className="admin-input" maxLength={32} value={form.last_name} onChange={setField("last_name")} required />
              </Field>
              <Field label="نام کاربری" hint="حروف انگلیسی کوچک، عدد، نقطه، - یا _ (۳ تا ۳۲ کاراکتر)">
                <input
                  className="admin-input"
                  dir="ltr"
                  maxLength={32}
                  autoComplete="off"
                  value={form.username}
                  onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s/g, "") }))}
                  required
                />
              </Field>
              <Field label="موبایل فروشنده (اختیاری)">
                <input className="admin-input" dir="ltr" inputMode="numeric" maxLength={11} placeholder="09xxxxxxxxx" value={form.phone_number} onChange={setField("phone_number")} />
              </Field>
              {!editing && (
                <Field label="رمز عبور" hint="حداقل ۸ کاراکتر، شامل حروف انگلیسی و عدد">
                  <input className="admin-input" dir="ltr" type="password" autoComplete="new-password" value={form.password} onChange={setField("password")} required />
                </Field>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_active} onChange={setField("is_active")} />
              حساب فعال باشد
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" className="admin-btn-secondary" onClick={() => setForm(null)}>انصراف</button>
              <button type="submit" className="admin-btn-accent">{editing ? "ذخیره تغییرات" : "ساخت فروشنده"}</button>
            </div>
          </form>
        )}

        {sellers === null ? (
          <p className="p-10 text-center text-sm text-gray-400">در حال بارگذاری...</p>
        ) : error ? (
          <p className="p-10 text-center text-sm text-red-500">{error}</p>
        ) : !sellers.length ? (
          <p className="p-10 text-center text-sm text-gray-400">هنوز فروشنده‌ای ساخته نشده است</p>
        ) : (
          <div className="admin-table-wrap border-0 rounded-none shadow-none">
            <table className="admin-table !min-w-[760px]">
              <thead>
                <tr>
                  <th>فروشنده</th>
                  <th>وضعیت</th>
                  <th>فروش</th>
                  <th>آخرین ورود</th>
                  <th className="text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className={seller.is_active ? "" : "opacity-60"}>
                    <td className="font-medium text-gray-800">
                      {seller.first_name} {seller.last_name}
                      <p className="text-[11px] text-gray-400">
                        نام کاربری: <span dir="ltr">{seller.username}</span>
                      </p>
                      {seller.phone_number && <p className="text-[11px] text-gray-400" dir="ltr">{seller.phone_number}</p>}
                    </td>
                    <td>
                      <button
                        type="button"
                        title="تغییر وضعیت"
                        onClick={() => toggleActive(seller)}
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          seller.is_active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-100 text-gray-500"
                        }`}
                      >
                        {seller.is_active ? "فعال" : "غیرفعال"}
                      </button>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="font-medium text-gray-800">{toman(seller.stats.paid_amount)}</span>
                      <p className="text-[11px] text-gray-400">
                        {fa(seller.stats.paid)} پرداخت‌شده
                        {seller.stats.pending ? ` · ${fa(seller.stats.pending)} در انتظار` : ""}
                      </p>
                    </td>
                    <td className="text-xs">{formatDateTime(seller.last_login_at)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50" onClick={() => setOrdersOf(seller)}>
                          <ReceiptLongOutlinedIcon sx={{ fontSize: 14 }} /> سفارش‌ها
                        </button>
                        <button type="button" title="ویرایش" aria-label="ویرایش" className={ICON_BTN} onClick={() => openEdit(seller)}>
                          <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                        <button type="button" title="تغییر رمز" aria-label="تغییر رمز" className={ICON_BTN} onClick={() => changePassword(seller)}>
                          <KeyOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                        <button type="button" title="حذف" aria-label="حذف" className={`${ICON_BTN} !border-red-200 !text-red-600 hover:!bg-red-50`} onClick={() => remove(seller)}>
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ordersOf && <SellerOrders key={ordersOf.id} seller={ordersOf} onClose={() => setOrdersOf(null)} />}
    </section>
  );
}

export default SellersMain;
