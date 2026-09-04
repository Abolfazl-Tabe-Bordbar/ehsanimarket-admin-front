"use client";

import {
  bannerAdminRules,
  bannerDesignSizes,
  bannerDeviceBreakpoints,
  bannerDeviceLabels,
  bannerGuideSections,
  bannerPages,
} from "@/components/admin/bannerConfig";

function BannerGuidelines() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 md:p-5 space-y-4 text-sm text-gray-700 leading-7">
      <div>
        <p className="font-bold text-brand-navy text-base mb-1">راهنمای بنرها</p>
        <p className="text-xs text-gray-500">
          قوانین طراحی و آپلود برای نمایش درست در سایت
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/80 bg-white/70 p-4 space-y-3">
          <p className="font-bold text-brand-navy">سه سایز دستگاه</p>
          <ul className="space-y-1 text-xs md:text-sm">
            {Object.entries(bannerDeviceBreakpoints).map(([key, label]) => (
              <li key={key}>
                <span className="font-medium">{bannerDeviceLabels[key]}:</span> {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/80 bg-white/70 p-4 space-y-3">
          <p className="font-bold text-brand-navy">مکان‌های نمایش</p>
          {bannerPages.map((page) => (
            <div key={page.value}>
              <p className="text-xs font-bold text-[#CA8549] mb-1">{page.label}</p>
              <ul className="space-y-1 text-xs md:text-sm">
                {bannerGuideSections[page.value]?.map((item) => (
                  <li key={item.section}>
                    {item.label}: {item.display}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-bold text-brand-navy">سایز پیشنهادی طراحی</p>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          {bannerDesignSizes.map((group) => (
            <div
              key={group.title}
              className="rounded-xl border border-white/80 bg-white/70 overflow-hidden"
            >
              <p className="px-3 py-2 text-xs font-bold text-brand-navy bg-white/90 border-b border-gray-100">
                {group.title}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-100">
                      <th className="px-3 py-2 text-right font-medium">دستگاه</th>
                      <th className="px-3 py-2 text-right font-medium">نسبت</th>
                      <th className="px-3 py-2 text-right font-medium">سایز</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr key={`${group.title}-${row.device}`} className="border-b border-gray-50 last:border-0">
                        <td className="px-3 py-2 whitespace-nowrap">{row.device}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{row.ratio}</td>
                        <td className="px-3 py-2 whitespace-nowrap dir-ltr text-left">{row.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/80 bg-white/70 p-4">
        <p className="font-bold text-brand-navy mb-2">چک‌لیست ادمین</p>
        <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
          {bannerAdminRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BannerGuidelines;
