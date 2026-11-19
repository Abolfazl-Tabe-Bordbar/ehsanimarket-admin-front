"use client";

import { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";

// لوگوی پیام‌رسان کنار نام کانال (فایل‌ها در public/images/platforms)
const PLATFORMS = {
  telegram: { label: "تلگرام", logo: "/images/platforms/telegram.svg", color: "#229ED9" },
  whatsapp: { label: "واتساپ", logo: "/images/platforms/whatsapp.svg", color: "#25D366" },
  bale: { label: "بله", logo: "/images/platforms/bale.webp", color: "#00A884" },
  eitaa: { label: "ایتا", logo: "/images/platforms/eitaa.webp", color: "#F57C00" },
  rubika: { label: "روبیکا", logo: "/images/platforms/rubika.webp", color: "#7B1FA2" },
  soroush: { label: "سروش", logo: "/images/platforms/soroush.webp", color: "#1E88E5" },
  instagram: { label: "اینستاگرام", color: "#E1306C", Icon: InstagramIcon },
};

function PlatformLogo({ channel, size = 22 }) {
  const platform = String(channel?.platform || "").toLowerCase();
  const config = PLATFORMS[platform] || { label: platform || "کانال", color: "#64748B" };
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size };

  if (config.logo && !failed) {
    return (
      <img
        src={config.logo}
        alt={config.label}
        title={config.label}
        style={box}
        className="shrink-0 rounded-md object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  // اگر لوگو نبود: آیکون یا حرف اول نام پیام‌رسان
  return (
    <span
      title={config.label}
      style={{ ...box, backgroundColor: config.color }}
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white"
    >
      {config.Icon ? (
        <config.Icon sx={{ fontSize: size * 0.62 }} />
      ) : (
        <span style={{ fontSize: size * 0.5 }} className="font-bold leading-none">{config.label[0]}</span>
      )}
    </span>
  );
}

export default PlatformLogo;
