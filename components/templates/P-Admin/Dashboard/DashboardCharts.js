"use client";

import React from "react";

const CHART_COLORS = {
  navy: "#253c8a",
  gold: "#CA8549",
  green: "#059669",
  amber: "#d97706",
  red: "#dc2626",
  gray: "#94a3b8",
};

function formatPrice(value) {
  return Number(value || 0).toLocaleString("fa-IR");
}

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`admin-section ${className}`.trim()}>
      <div className="mb-5">
        <h2 className="admin-section-title !border-0 !pb-0 mb-1">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function DonutChart({ segments, size = 168 }) {
  const total = segments.reduce((sum, item) => sum + item.value, 0);
  const radius = 38;
  const stroke = 14;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-sm text-gray-500">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  let offset = 0;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#eef1f8"
            strokeWidth={stroke}
          />
          {segments.map((segment) => {
            const length = (segment.value / total) * circumference;
            const dasharray = `${length} ${circumference - length}`;
            const circle = (
              <circle
                key={segment.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={stroke}
                strokeDasharray={dasharray}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-brand-navy">{formatPrice(total)}</span>
          <span className="text-[11px] text-gray-400">کل</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-600 truncate">{segment.label}</span>
            </div>
            <div className="text-left shrink-0">
              <span className="text-sm font-bold text-brand-navy">{formatPrice(segment.value)}</span>
              <span className="text-[11px] text-gray-400 mr-1">
                ({Math.round((segment.value / total) * 100)}٪)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, valueKey = "value", color = CHART_COLORS.navy, suffix = "" }) {
  const max = Math.max(...data.map((item) => item[valueKey] || 0), 1);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-gray-500">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-2 h-52 pt-4">
      {data.map((item) => {
        const value = item[valueKey] || 0;
        const height = `${Math.max((value / max) * 100, value > 0 ? 8 : 0)}%`;

        return (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <span className="text-[10px] md:text-xs font-medium text-brand-navy">
              {formatPrice(value)}
              {suffix}
            </span>
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{ height, backgroundColor: color, minHeight: value > 0 ? "8px" : "0" }}
                title={`${item.label}: ${formatPrice(value)}${suffix}`}
              />
            </div>
            <span className="text-[10px] text-gray-400 text-center leading-tight">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalBarChart({ items }) {
  const max = Math.max(...items.map((item) => item.value || 0), 1);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-bold text-brand-navy">{formatPrice(item.value)}</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardCharts({ charts }) {
  if (!charts) return null;

  const orderSegments = [
    {
      label: "در انتظار ارسال",
      value: charts.orderStatus?.pending || 0,
      color: CHART_COLORS.amber,
    },
    {
      label: "ارسال‌شده",
      value: charts.orderStatus?.sent || 0,
      color: CHART_COLORS.green,
    },
    {
      label: "لغو شده",
      value: charts.orderStatus?.cancelled || 0,
      color: CHART_COLORS.red,
    },
  ];

  const stockItems = [
    {
      label: "محصولات فعال",
      value: charts.productStock?.active || 0,
      color: CHART_COLORS.navy,
    },
    {
      label: "موجودی کم",
      value: charts.productStock?.lowStock || 0,
      color: CHART_COLORS.gold,
    },
    {
      label: "ناموجود",
      value: charts.productStock?.outOfStock || 0,
      color: CHART_COLORS.red,
    },
    {
      label: "غیرفعال",
      value: charts.productStock?.disabled || 0,
      color: CHART_COLORS.gray,
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <ChartCard title="درآمد ۷ روز اخیر" subtitle="مجموع فروش روزانه (تومان)">
        <BarChart
          data={charts.salesLast7Days || []}
          valueKey="revenue"
          color={CHART_COLORS.gold}
        />
      </ChartCard>

      <ChartCard title="سفارشات ۷ روز اخیر" subtitle="تعداد سفارش پرداخت‌شده در هر روز">
        <BarChart
          data={charts.salesLast7Days || []}
          valueKey="orders"
          color={CHART_COLORS.navy}
        />
      </ChartCard>

      <ChartCard title="وضعیت سفارشات" subtitle="توزیع سفارشات پرداخت‌شده">
        <DonutChart segments={orderSegments} />
      </ChartCard>

      <ChartCard title="وضعیت موجودی محصولات" subtitle="نمای کلی انبار">
        <HorizontalBarChart items={stockItems} />
      </ChartCard>

      <ChartCard title="کاربران جدید" subtitle="ثبت‌نام ۷ روز اخیر" className="xl:col-span-2">
        <BarChart
          data={charts.usersLast7Days || []}
          valueKey="count"
          color={CHART_COLORS.green}
        />
      </ChartCard>
    </div>
  );
}

export default DashboardCharts;
