import React from "react";
import WalletIcon from "@mui/icons-material/Wallet";

function KavenegarBalance({ kavenegarBalance }) {
  return (
    <div className="flex justify-end">
      <div className="inline-flex items-center gap-2 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 px-4 py-3 text-sm text-brand-navy">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold text-white">
          <WalletIcon sx={{ fontSize: 18 }} />
        </span>
        <span>موجودی پنل اس‌ام‌اس:</span>
        <span className="font-bold">
          {Number(kavenegarBalance?.balance).toLocaleString("fa-IR")} ریال
        </span>
      </div>
    </div>
  );
}

export default KavenegarBalance;
