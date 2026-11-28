"use client";

import { useEffect, useState } from "react";

function padFa(value) {
  return String(value)
    .padStart(2, "0")
    .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function StripCountdownPreview({ endsAt }) {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    if (!endsAt) {
      setLeft(null);
      return;
    }
    const tick = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setLeft({ expired: true, days: 0, hours: 0 });
        return;
      }
      setLeft({
        expired: false,
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
      });
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, [endsAt]);

  if (!endsAt || !left || left.expired) {
    return <p className="text-xs text-white/70">زمان پایان را تنظیم کنید</p>;
  }

  return (
    <p className="text-base font-bold tracking-[0.2em] text-white tabular-nums" dir="ltr">
      {padFa(left.days)} : {padFa(left.hours)}
    </p>
  );
}

function AmazingFestivalPanelPreview({ name, endsAt, color1, color2, imageUrl }) {
  const from = color1 || "#c62828";
  const to = color2 || "#8b1a1a";
  const gradient = { background: `linear-gradient(to left, ${from}, ${to})` };

  return (
    <div className="overflow-hidden rounded-xl shadow-md" style={gradient}>
      <div className="flex min-h-[140px] flex-col md:flex-row">
        <aside className="flex w-full shrink-0 flex-col items-center justify-between gap-2 border-b border-white/25 px-2 py-3 text-center text-white md:w-28 md:border-b-0 md:border-s">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-10 w-10 object-contain" />
          ) : (
            <span className="text-2xl font-black leading-none">%</span>
          )}
          <p className="text-[11px] font-bold leading-snug line-clamp-2">{name || "شگفت‌انگیز"}</p>
          <StripCountdownPreview endsAt={endsAt} />
          <span className="w-full rounded-full bg-white py-1 text-[10px] font-bold" style={{ color: from }}>
            مشاهده همه
          </span>
        </aside>
        <div className="flex flex-1 items-center gap-2 p-2">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="h-[110px] flex-1 rounded-lg bg-white/95 shadow-sm"
              aria-hidden
            />
          ))}
        </div>
      </div>
      <p className="bg-black/15 px-2 py-1 text-center text-[10px] text-white/85">
        پیش‌نمایش نوار شگفت‌انگیز در صفحه اصلی
      </p>
    </div>
  );
}

export default AmazingFestivalPanelPreview;