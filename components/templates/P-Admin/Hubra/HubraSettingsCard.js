"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Loader from "@/components/modules/Loader";
import { getHubraSettings, saveHubraSettings } from "@/funcs/hubra";

// بخش «هابرا» در تنظیمات سایت: ثبت توکن API (فقط نوشتنی؛ توکن هیچ‌وقت نمایش داده نمی‌شود)
function HubraSettingsCard() {
  const [settings, setSettings] = useState(null);
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getHubraSettings().then((res) => setSettings(res?.status ? res.body : { error: res?.message }));
  }, []);

  const save = async (value) => {
    setBusy(true);
    const res = await saveHubraSettings(value);
    setBusy(false);
    if (res?.status) {
      setSettings(res.body);
      setToken("");
    }
  };

  const remove = async () => {
    const confirm = await Swal.fire({
      title: "حذف توکن هابرا",
      text: "بعد از حذف، ارسال به کانال‌ها تا ثبت توکن جدید متوقف می‌شود.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "حذف شود",
      cancelButtonText: "انصراف",
    });
    if (confirm.isConfirmed) save("");
  };

  return (
    <section id="hubra" className="admin-section">
      {busy && <Loader />}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <h2 className="text-base font-bold text-[#253c8a]">اتصال هابرا (ارسال به کانال‌ها)</h2>
        {settings?.has_token ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">متصل</span>
        ) : settings ? (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-500">متصل نیست</span>
        ) : null}
      </div>

      <p className="text-xs leading-6 text-gray-500">
        توکن API را از پنل هابرا (بخش احراز هویت) بسازید و اینجا وارد کنید. توکن فقط روی سرور نگه داشته می‌شود و
        دوباره نمایش داده نمی‌شود. برای ارسال، حساب هابرا باید پلن فعال و حداقل یک کانال متصل داشته باشد.
      </p>

      {settings?.error ? (
        <p className="text-sm text-red-500">{settings.error}</p>
      ) : settings?.source === "env" ? (
        <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
          توکن از متغیر محیطی سرور (HUBRA_API_TOKEN) خوانده می‌شود: <span dir="ltr">{settings.token_hint}</span>
        </p>
      ) : (
        <>
          {settings?.has_token && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600">
              <span>
                توکن فعلی: <span dir="ltr" className="font-mono">{settings.token_hint}</span>
              </span>
              <button type="button" onClick={remove} className="text-red-500 hover:underline">
                حذف توکن
              </button>
            </div>
          )}
          <div>
            <label htmlFor="hubra-token" className="mb-1.5 block text-sm font-medium text-gray-700">
              {settings?.has_token ? "توکن جدید (برای جایگزینی)" : "توکن API هابرا"}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="hubra-token"
                  type={show ? "text" : "password"}
                  dir="ltr"
                  autoComplete="off"
                  className="admin-input pl-10 font-mono"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Bearer token"
                />
                <button
                  type="button"
                  onClick={() => setShow((value) => !value)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={show ? "مخفی کردن" : "نمایش"}
                >
                  {show ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </button>
              </div>
              <button type="button" className="admin-btn-accent shrink-0" disabled={!token.trim()} onClick={() => save(token)}>
                بررسی و ذخیره
              </button>
            </div>
          </div>
        </>
      )}

      {settings?.has_token && (
        <Link href="/p-admin/hubra" className="inline-block text-sm font-medium text-[#CA8549] hover:underline">
          رفتن به بخش ارسال به کانال‌ها
        </Link>
      )}
    </section>
  );
}

export default HubraSettingsCard;
