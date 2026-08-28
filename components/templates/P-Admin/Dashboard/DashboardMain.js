"use client";

import Link from "next/link";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import DashboardCharts from "./DashboardCharts";
import { uploadUrl } from "@/data/variables";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

const orderStatusLabels = {
  0: { label: "در انتظار ارسال", className: "bg-amber-100 text-amber-800" },
  1: { label: "ارسال‌شده", className: "bg-emerald-100 text-emerald-800" },
  2: { label: "لغو شده", className: "bg-red-100 text-red-700" },
};

function formatPrice(value) {
  return Number(value || 0).toLocaleString("fa-IR");
}

function HeroStat({ icon: Icon, label, value, hint, href }) {
  const content = (
    <div className="flex h-full min-h-[104px] flex-col justify-between rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3.5">
      <div className="flex items-center gap-2 text-white/70 min-h-[20px]">
        <Icon sx={{ fontSize: 18, flexShrink: 0 }} />
        <span className="text-xs leading-tight">{label}</span>
      </div>
      <div>
        <p className="text-xl md:text-2xl font-bold text-white leading-none">
          {formatPrice(value)}
        </p>
        <p className={`text-[11px] mt-1.5 min-h-[16px] ${hint ? "text-white/50" : "invisible"}`}>
          {hint || "—"}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full transition-transform hover:-translate-y-0.5">
        {content}
      </Link>
    );
  }

  return content;
}

function StatCard({ title, value, hint, href, accent = "navy", icon: Icon }) {
  const accents = {
    navy: "border-brand-navy/15 bg-brand-navy/[0.03]",
    gold: "border-brand-gold/25 bg-brand-gold/[0.06]",
    green: "border-emerald-200 bg-emerald-50/60",
    red: "border-red-200 bg-red-50/60",
  };

  const iconColors = {
    navy: "bg-brand-navy/10 text-brand-navy",
    gold: "bg-brand-gold/15 text-brand-gold",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-600",
  };

  const content = (
    <div
      className={`admin-card !p-4 md:!p-5 h-full transition-transform hover:-translate-y-0.5 ${accents[accent] || accents.navy}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs md:text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-brand-navy">
            {formatPrice(value)}
          </p>
          {hint && (
            <p className="text-[11px] md:text-xs text-gray-400 mt-2">{hint}</p>
          )}
        </div>
        {Icon && (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColors[accent] || iconColors.navy}`}
          >
            <Icon sx={{ fontSize: 20 }} />
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base md:text-lg font-bold text-brand-navy mb-4">
      {children}
    </h2>
  );
}

function DashboardMain({ stats, adminName }) {
  if (!stats) {
    return (
      <AdminPageShell title="داشبورد" description="آمار کلی سایت">
        <div className="admin-empty">
          <p className="admin-empty-text">امکان دریافت آمار وجود ندارد.</p>
        </div>
      </AdminPageShell>
    );
  }

  const pendingComments =
    (stats.comments?.productsPending || 0) +
    (stats.comments?.articlesPending || 0);

  const charts = stats.charts || {
    salesLast7Days: [],
    usersLast7Days: [],
    orderStatus: {
      pending: stats.orders?.pending || 0,
      sent: stats.orders?.sent || 0,
      cancelled: stats.orders?.cancelled || 0,
    },
    productStock: {
      active: stats.products?.total || 0,
      lowStock: stats.products?.lowStock || 0,
      outOfStock: stats.products?.outOfStock || 0,
      disabled: stats.products?.disabled || 0,
    },
  };

  return (
    <AdminPageShell
      title={`سلام ${adminName || "مدیر"} 👋`}
      description="خلاصه وضعیت فروشگاه، سفارشات و محتوای سایت"
    >
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-l from-brand-navy via-brand-navy-light to-brand-gold p-5 md:p-7 shadow-lg shadow-brand-navy/15">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="text-white shrink-0">
              <p className="text-sm text-white/70 mb-1">داشبورد مدیریت</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                وضعیت امروز فروشگاه
              </h2>
              <p className="text-sm text-white/75 max-w-xl">
                {formatPrice(stats.revenue?.today)} تومان درآمد امروز ·{" "}
                {formatPrice(stats.orders?.pending)} سفارش در انتظار ·{" "}
                {formatPrice(stats.products?.lowStock)} محصول با موجودی کم
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:flex-1 lg:max-w-3xl">
              <HeroStat
                icon={PaymentsOutlinedIcon}
                label="درآمد امروز"
                value={stats.revenue?.today}
                hint="تومان"
              />
              <HeroStat
                icon={ShoppingBasketOutlinedIcon}
                label="سفارشات جاری"
                value={stats.orders?.pending}
                href="/p-admin/purchases?p=1&status=pending"
              />
              <HeroStat
                icon={LocalMallOutlinedIcon}
                label="محصولات فعال"
                value={stats.products?.total}
                href="/p-admin/products?p=1"
              />
              <HeroStat
                icon={PersonOutlineOutlinedIcon}
                label="کاربران"
                value={stats.users?.total}
                href="/p-admin/users?p=1"
              />
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>شاخص‌های کلیدی</SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              title="درآمد کل"
              value={stats.revenue?.total}
              hint="تومان"
              accent="gold"
              icon={PaymentsOutlinedIcon}
            />
            <StatCard
              title="سفارشات پرداخت‌شده"
              value={stats.orders?.totalPaid}
              href="/p-admin/purchases?p=1&status=pending"
              icon={ShoppingBasketOutlinedIcon}
            />
            <StatCard
              title="ارسال‌شده"
              value={stats.orders?.sent}
              href="/p-admin/purchases?p=1&status=send"
              accent="green"
            />
            <StatCard
              title="نظرات در انتظار"
              value={pendingComments}
              accent={pendingComments > 0 ? "red" : "navy"}
            />
          </div>
        </section>

        <section>
          <SectionTitle>نمودارها و تحلیل</SectionTitle>
          <DashboardCharts charts={charts} />
        </section>

        <section>
          <SectionTitle>جزئیات سریع</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <StatCard
              title="موجودی کم"
              value={stats.products?.lowStock}
              href="/p-admin/products?p=1"
              accent="gold"
            />
            <StatCard
              title="ناموجود"
              value={stats.products?.outOfStock}
              href="/p-admin/products?p=1"
              accent="red"
            />
            <StatCard title="مقالات" value={stats.content?.articles} href="/p-admin/articles" />
            <StatCard
              title="پیش‌نویس"
              value={stats.content?.articlesDraft}
              href="/p-admin/articles"
              accent="gold"
            />
            <StatCard title="بنرها" value={stats.content?.banners} href="/p-admin/banners" />
            <StatCard
              title="پلن تخفیف فعال"
              value={stats.discounts?.active}
              href="/p-admin/discount-plans"
              accent="green"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="admin-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="admin-section-title !border-0 !pb-0 mb-0">
                آخرین سفارشات
              </h2>
              <Link
                href="/p-admin/purchases?p=1&status=pending"
                className="text-xs text-brand-gold hover:underline"
              >
                مشاهده همه
              </Link>
            </div>
            {!stats.recentOrders?.length ? (
              <p className="text-sm text-gray-500 text-center py-6">
                هنوز سفارشی ثبت نشده است.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => {
                  const status =
                    orderStatusLabels[order.status_after_paid] ||
                    orderStatusLabels[0];
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-brand-navy truncate">
                          {order.user
                            ? `${order.user.first_name} ${order.user.last_name}`
                            : "کاربر"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-sm font-bold">
                          {formatPrice(order.total_price)}{" "}
                          <span className="text-[10px] font-normal text-gray-400">
                            تومان
                          </span>
                        </p>
                        <span
                          className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="admin-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="admin-section-title !border-0 !pb-0 mb-0">
                محصولات با موجودی کم
              </h2>
              <Link
                href="/p-admin/products?p=1"
                className="text-xs text-brand-gold hover:underline"
              >
                مدیریت محصولات
              </Link>
            </div>
            {!stats.lowStockProducts?.length ? (
              <p className="text-sm text-gray-500 text-center py-6">
                محصولی با موجودی کم وجود ندارد.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-3"
                  >
                    {product.image ? (
                      <img
                        src={`${uploadUrl}/products/${product.image}`}
                        alt=""
                        className="w-12 h-12 object-contain rounded-lg bg-white border border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-100" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-navy line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        موجودی: {formatPrice(product.count)} عدد
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminPageShell>
  );
}

export default DashboardMain;
