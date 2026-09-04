"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import EmptyMessage from "@/components/modules/EmptyMessage";
import Loader from "@/components/modules/Loader";
import getUserDetail from "@/funcs/getUserDetail";
import getCookie from "@/funcs/cookies/getCookie";
import PurchaseDetailsModal from "@/components/templates/P-Admin/Purchases/PurchaseDetailsModal";
import { purchaseTabStatusConfig } from "@/components/templates/P-Admin/Purchases/purchaseHelpers";
import { siteUrl, uploadUrl } from "@/data/variables";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const tabs = [
  { id: "info", label: "اطلاعات کاربر" },
  { id: "orders", label: "خریدها" },
  { id: "productComments", label: "نظرات محصولات" },
  { id: "articleComments", label: "نظرات مقالات" },
  { id: "wishlists", label: "علاقه‌مندی‌ها" },
  { id: "cart", label: "سبد خرید" },
];

function formatAddress(user) {
  if (user?.province && user?.city) {
    return `${user.province}، ${user.city}، ${user.address || ""}`.replace(/،\s*$/, "");
  }
  return user?.address || "—";
}

function getOrderTabStatus(order) {
  if (order.status !== 1) return null;
  if (order.status_after_paid === 1) return "send";
  if (order.status_after_paid === 2) return "not-send";
  return "pending";
}

function getOrderStatusBadge(order) {
  if (order.status === 0) {
    return { label: "در انتظار پرداخت", className: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  if (order.status === 2) {
    return { label: "لغو شده", className: "bg-gray-100 text-gray-600 border-gray-200" };
  }

  const tabStatus = getOrderTabStatus(order);
  if (tabStatus && purchaseTabStatusConfig[tabStatus]) {
    return purchaseTabStatusConfig[tabStatus];
  }

  return { label: order.statusLabel || "پرداخت شده", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

function ApprovalBadge({ isApproved }) {
  if (isApproved) {
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
        تایید شده
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border-amber-200">
      در انتظار تایید
    </span>
  );
}

function UserDetailMain({ userId }) {
  const [activeTab, setActiveTab] = useState("info");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    getUserDetail(getCookie("ramian-pakhsh-admin"), userId).then((res) => {
      if (!cancelled) {
        setData(res);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (isLoading) {
    return (
      <AdminPageShell title="جزئیات کاربر">
        <Loader />
      </AdminPageShell>
    );
  }

  if (!data?.status || !data?.body) {
    return (
      <AdminPageShell title="جزئیات کاربر">
        <EmptyMessage text={data?.message || "کاربر یافت نشد."} />
        <Link href="/p-admin/users?p=1" className="admin-btn-secondary inline-flex mt-4">
          بازگشت به لیست کاربران
        </Link>
      </AdminPageShell>
    );
  }

  const { user, stats, orders, productComments, articleComments, wishlists, shoppingCarts } =
    data.body;
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "کاربر";

  return (
    <AdminPageShell
      title={fullName}
      description="مشاهده اطلاعات کامل کاربر، خریدها، نظرات و فعالیت‌ها"
      actions={
        <Link href="/p-admin/users?p=1" className="admin-btn-secondary inline-flex items-center gap-1">
          بازگشت
          <ArrowBackIcon fontSize="small" />
        </Link>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div className="admin-card px-4 py-3 text-center">
          <p className="text-xs text-gray-500 mb-1">خریدهای موفق</p>
          <p className="text-lg font-bold">{stats.ordersCount.toLocaleString("fa")}</p>
        </div>
        <div className="admin-card px-4 py-3 text-center">
          <p className="text-xs text-gray-500 mb-1">نظر محصول</p>
          <p className="text-lg font-bold">{stats.productCommentsCount.toLocaleString("fa")}</p>
        </div>
        <div className="admin-card px-4 py-3 text-center">
          <p className="text-xs text-gray-500 mb-1">نظر مقاله</p>
          <p className="text-lg font-bold">{stats.articleCommentsCount.toLocaleString("fa")}</p>
        </div>
        <div className="admin-card px-4 py-3 text-center">
          <p className="text-xs text-gray-500 mb-1">علاقه‌مندی</p>
          <p className="text-lg font-bold">{stats.wishlistsCount.toLocaleString("fa")}</p>
        </div>
        <div className="admin-card px-4 py-3 text-center">
          <p className="text-xs text-gray-500 mb-1">سبد خرید</p>
          <p className="text-lg font-bold">{stats.cartItemsCount.toLocaleString("fa")}</p>
        </div>
      </div>

      <div className="admin-tabs mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab ${activeTab === tab.id ? "admin-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "info" && (
        <div className="admin-card p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 shrink-0">نام و نام خانوادگی:</span>
              <span>{fullName}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 shrink-0">شماره تماس:</span>
              <span className="dir-ltr">{user.phone_number || "—"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 shrink-0">نام کاربری:</span>
              <span className="dir-ltr">{user.username || "—"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 shrink-0">تاریخ ثبت‌نام:</span>
              <span>{new Date(user.createdAt).toLocaleDateString("fa-IR")}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 shrink-0">استان:</span>
              <span>{user.province || "—"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 shrink-0">شهر:</span>
              <span>{user.city || "—"}</span>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <span className="font-bold text-gray-600 shrink-0">آدرس:</span>
              <span>{formatAddress(user)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-600 shrink-0">کد پستی:</span>
              <span>{user.post_code || "—"}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-3">
          {!orders.length ? (
            <EmptyMessage text="این کاربر هنوز سفارشی ثبت نکرده است." />
          ) : (
            orders.map((order) => {
              const statusBadge = getOrderStatusBadge(order);
              const tabStatus = getOrderTabStatus(order);
              const canShowDetails = order.status === 1 && order.payment;

              return (
                <div key={order.id} className="admin-card py-4 px-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8">
                    <div className="whitespace-nowrap text-sm">
                      <span>شناسه سفارش:</span>{" "}
                      <span className="font-bold">{order.id.toLocaleString("fa")}</span>
                    </div>
                    <div className="whitespace-nowrap text-sm">
                      <span>تاریخ:</span>{" "}
                      <span className="font-bold">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <div className="whitespace-nowrap text-sm">
                      <span>مبلغ:</span>{" "}
                      <span className="font-bold">{order.total_price.toLocaleString("fa")} تومان</span>
                    </div>
                    <span
                      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  {canShowDetails ? (
                    <button
                      type="button"
                      className="whitespace-nowrap flex items-center gap-1 text-[#004B8F] cursor-pointer text-sm"
                      onClick={() => setSelectedOrder({ order, status: tabStatus || "pending" })}
                    >
                      نمایش جزئیات
                      <KeyboardArrowDownOutlinedIcon fontSize="small" />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {order.orderItems?.length || 0} قلم کالا
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "productComments" && (
        <div className="space-y-3">
          {!productComments.length ? (
            <EmptyMessage text="نظری برای محصولات ثبت نشده است." />
          ) : (
            productComments.map((comment) => (
              <div key={comment.id} className="admin-card p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {comment.product?.image && (
                      <img
                        src={`${uploadUrl}/products/${comment.product.image}`}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                      />
                    )}
                    {comment.product ? (
                      <a
                        href={`${siteUrl}/product/${comment.product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-[#004B8F] truncate"
                      >
                        {comment.product.name}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">محصول حذف شده</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ApprovalBadge isApproved={comment.is_approved} />
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-7">{comment.body}</p>
                {comment.replies?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {comment.replies.length.toLocaleString("fa")} پاسخ
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "articleComments" && (
        <div className="space-y-3">
          {!articleComments.length ? (
            <EmptyMessage text="نظری برای مقالات ثبت نشده است." />
          ) : (
            articleComments.map((comment) => (
              <div key={comment.id} className="admin-card p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {comment.article ? (
                    <a
                      href={`${siteUrl}/articles/${comment.article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-[#004B8F] truncate"
                    >
                      {comment.article.title}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">مقاله حذف شده</span>
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <ApprovalBadge isApproved={comment.is_approved} />
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-7">{comment.body}</p>
                {comment.replies?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {comment.replies.length.toLocaleString("fa")} پاسخ
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "wishlists" && (
        <div className="space-y-3">
          {!wishlists.length ? (
            <EmptyMessage text="محصولی در علاقه‌مندی‌ها نیست." />
          ) : (
            wishlists.map((item) => (
              <div key={item.id} className="admin-card p-4 flex items-center gap-4">
                {item.product?.images_path?.[0] && (
                  <img
                    src={`${uploadUrl}/products/${item.product.images_path[0]}`}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{item.product?.name || "محصول حذف شده"}</p>
                  {item.product?.price != null && (
                    <p className="text-sm text-gray-600 mt-1">
                      {item.product.price.toLocaleString("fa")} تومان
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "cart" && (
        <div className="space-y-3">
          {!shoppingCarts.length ? (
            <EmptyMessage text="سبد خرید این کاربر خالی است." />
          ) : (
            shoppingCarts.map((item) => (
              <div key={item.id} className="admin-card p-4 flex items-center gap-4">
                {item.product?.images_path?.[0] && (
                  <img
                    src={`${uploadUrl}/products/${item.product.images_path[0]}`}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{item.product?.name || "محصول حذف شده"}</p>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                    {item.product?.price != null && (
                      <span>قیمت: {item.product.price.toLocaleString("fa")} تومان</span>
                    )}
                    <span>تعداد: {(item.count || 1).toLocaleString("fa")}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {new Date(item.added_at || item.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {selectedOrder && (
        <PurchaseDetailsModal
          setIsPurchaseDetailsModalShow={() => setSelectedOrder(null)}
          purchaseInfo={selectedOrder.order}
          status={selectedOrder.status}
        />
      )}
    </AdminPageShell>
  );
}

export default UserDetailMain;
