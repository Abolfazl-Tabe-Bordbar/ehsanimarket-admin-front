"use client";

import Link from "next/link";

function HomeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotFoundIllustration() {
  return (
    <svg viewBox="0 0 240 180" className="w-full max-w-[280px] mx-auto" aria-hidden="true">
      <circle cx="120" cy="90" r="70" fill="#253c8a" fillOpacity="0.06" />
      <circle cx="120" cy="90" r="48" fill="#CA8549" fillOpacity="0.12" />
      <rect x="72" y="58" width="96" height="72" rx="16" fill="#fff" stroke="#253c8a" strokeWidth="2.5" />
      <circle cx="96" cy="82" r="6" fill="#CA8549" />
      <circle cx="144" cy="82" r="6" fill="#CA8549" />
      <path d="M98 108 Q120 122 142 108" stroke="#253c8a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M120 34 L120 52 M104 42 L136 42" stroke="#CA8549" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ServerErrorIllustration() {
  return (
    <svg viewBox="0 0 240 180" className="w-full max-w-[280px] mx-auto" aria-hidden="true">
      <circle cx="120" cy="90" r="70" fill="#CA8549" fillOpacity="0.08" />
      <rect x="70" y="48" width="100" height="28" rx="8" fill="#fff" stroke="#253c8a" strokeWidth="2.5" />
      <rect x="70" y="84" width="100" height="28" rx="8" fill="#fff" stroke="#253c8a" strokeWidth="2.5" />
      <rect x="70" y="120" width="100" height="28" rx="8" fill="#fff" stroke="#253c8a" strokeWidth="2.5" />
      <circle cx="88" cy="62" r="4" fill="#CA8549" />
      <circle cx="102" cy="62" r="4" fill="#22c55e" />
      <circle cx="88" cy="98" r="4" fill="#CA8549" />
      <circle cx="88" cy="134" r="4" fill="#ef4444" />
      <path d="M148 62 L164 76 M164 62 L148 76" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ErrorPageLayout({
  code = "404",
  title = "صفحه پیدا نشد",
  description = "صفحه‌ای که دنبال آن هستید وجود ندارد یا منتقل شده است.",
  variant = "not-found",
  primaryHref = "/p-admin",
  primaryLabel = "بازگشت به پنل",
  secondaryHref = null,
  secondaryLabel = "",
  onRetry,
  retryLabel = "تلاش مجدد",
  homeHref = "/p-admin",
  brandName = "پنل مدیریت",
}) {
  const Illustration = variant === "error" ? ServerErrorIllustration : NotFoundIllustration;

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(202,133,73,0.12) 0%, transparent 40%), radial-gradient(circle at 85% 10%, rgba(37,60,138,0.1) 0%, transparent 35%)",
        }}
      />

      <header className="relative z-10 px-4 sm:px-6 md:px-10 py-5">
        <Link href={homeHref} className="inline-block">
          <img src="/images/logo-1.png" alt={brandName} className="h-12 w-auto" />
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg text-center">
          <div className="mb-6">
            <Illustration />
          </div>

          <p className="text-7xl md:text-8xl font-black leading-none bg-gradient-to-l from-[#253c8a] to-[#CA8549] bg-clip-text text-transparent mb-4">
            {code}
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{title}</h1>
          <p className="text-gray-500 text-sm md:text-base leading-7 max-w-md mx-auto mb-8">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#253c8a] hover:bg-[#1e3270] text-white font-medium transition-colors shadow-lg shadow-[#253c8a]/20"
            >
              <HomeIcon />
              {primaryLabel}
            </Link>

            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-xl border border-[#CA8549] text-[#CA8549] hover:bg-[#CA8549]/5 font-medium transition-colors"
              >
                {retryLabel}
              </button>
            ) : secondaryHref ? (
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-xl border border-[#CA8549] text-[#CA8549] hover:bg-[#CA8549]/5 font-medium transition-colors"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
