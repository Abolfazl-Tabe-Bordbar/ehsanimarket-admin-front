export const purchaseTabStatusConfig = {
  pending: {
    label: "در انتظار تایید",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    emptyMessage: "هنوز تایید یا رد نشده است",
  },
  preparing: {
    label: "در حال آماده‌سازی",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    emptyMessage: "پیامی ثبت نشده",
  },
  shipping: {
    label: "در حال ارسال",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    emptyMessage: "پیامی ثبت نشده",
  },
  shipped: {
    label: "ارسال شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    emptyMessage: "پیامی ثبت نشده",
  },
  send: {
    label: "ارسال شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    emptyMessage: "پیامی ثبت نشده",
  },
  "not-send": {
    label: "رد شده",
    className: "bg-red-50 text-red-700 border-red-200",
    emptyMessage: "دلیل رد ثبت نشده",
  },
};

export const purchaseTabToStatusAfterPaid = {
  pending: 0,
  preparing: 1,
  shipping: 3,
  shipped: 4,
  send: 4,
  "not-send": 2,
};

export const purchaseMessageStageByTab = {
  pending: "approve",
  preparing: "preparing",
  shipping: "shipping",
};

export const orderMessageStageConfig = {
  approve: {
    title: "پیام‌های تایید",
    description: "برای انتقال سفارش به «در حال آماده‌سازی»",
    emptyText: "هنوز پیامی برای تایید ثبت نشده است.",
    addLabel: "افزودن پیام تایید",
  },
  preparing: {
    title: "پیام‌های آماده‌سازی",
    description: "برای انتقال سفارش به «در حال ارسال»",
    emptyText: "هنوز پیامی برای آماده‌سازی ثبت نشده است.",
    addLabel: "افزودن پیام آماده‌سازی",
  },
  shipping: {
    title: "پیام‌های ارسال",
    description: "برای ثبت «ارسال شده»",
    emptyText: "هنوز پیامی برای ارسال ثبت نشده است.",
    addLabel: "افزودن پیام ارسال",
  },
};

export const purchaseNextStepConfig = {
  preparing: {
    nextStatus: 3,
    buttonLabel: "رفتن به در حال ارسال",
    title: "ارسال سفارش",
    description: "سفارش به مرحله «در حال ارسال» منتقل می‌شود.",
    defaultMessage: "سفارش شما در حال ارسال است.",
  },
  shipping: {
    nextStatus: 4,
    buttonLabel: "ثبت ارسال شده",
    title: "تکمیل ارسال",
    description: "سفارش به عنوان «ارسال شده» ثبت می‌شود.",
    defaultMessage: "سفارش شما ارسال شد.",
  },
};

export function getPurchaseUserMessage(purchaseInfo, tabStatus) {
  const message = purchaseInfo?.status_after_paid_message?.trim();
  if (message) return message;

  const config = purchaseTabStatusConfig[tabStatus];
  return config?.emptyMessage || "";
}

export function getPurchaseAdminInternalMessage(purchaseInfo) {
  const message =
    purchaseInfo?.status_after_paid_admin_message?.trim() ||
    purchaseInfo?.rejectionReason?.admin_message?.trim();

  return message || "پیام داخلی ثبت نشده";
}

export function getPurchaseAdminMessage(purchaseInfo, tabStatus) {
  if (tabStatus === "not-send") {
    return getPurchaseAdminInternalMessage(purchaseInfo);
  }

  return getPurchaseUserMessage(purchaseInfo, tabStatus);
}

export const purchaseStageDateFields = {
  paid: "paid_at",
  pending: "paid_at",
  preparing: "approved_at",
  shipping: "shipping_at",
  shipped: "shipped_at",
  send: "shipped_at",
  "not-send": "rejected_at",
};

export function getPurchaseStageDate(purchaseInfo, stageKey) {
  const field = purchaseStageDateFields[stageKey];
  const rawDate =
    (field && purchaseInfo?.[field]) ||
    (stageKey !== "pending" && stageKey !== "paid"
      ? purchaseInfo?.status_after_paid_at
      : null);

  if (!rawDate) return null;

  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getPurchaseReviewDate(purchaseInfo, tabStatus) {
  if (tabStatus === "pending") {
    return getPurchaseStageDate(purchaseInfo, "paid");
  }

  return getPurchaseStageDate(purchaseInfo, tabStatus);
}

export function getPurchaseStageTimeline(purchaseInfo) {
  const stages = [
    { key: "paid", label: "پرداخت", date: getPurchaseStageDate(purchaseInfo, "paid") },
    { key: "approved", label: "تایید", date: getPurchaseStageDate(purchaseInfo, "preparing") },
    { key: "shipping", label: "شروع ارسال", date: getPurchaseStageDate(purchaseInfo, "shipping") },
    { key: "shipped", label: "ارسال شده", date: getPurchaseStageDate(purchaseInfo, "shipped") },
    { key: "rejected", label: "رد", date: getPurchaseStageDate(purchaseInfo, "not-send") },
  ];

  return stages.filter((stage) => stage.date);
}

export function formatPurchaseDateTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getPurchaseReviewDateLabel(tabStatus) {
  if (tabStatus === "pending") return "تاریخ پرداخت";
  if (tabStatus === "shipped" || tabStatus === "send") return "تاریخ ارسال";
  if (tabStatus === "shipping") return "تاریخ شروع ارسال";
  if (tabStatus === "preparing") return "تاریخ تایید";
  if (tabStatus === "not-send") return "تاریخ رد";
  return "تاریخ بررسی";
}

function getPurchaseStageDurationBounds(purchaseInfo, tabStatus) {
  const now = new Date();

  if (tabStatus === "pending") {
    return {
      startAt: getPurchaseStageDate(purchaseInfo, "paid") || purchaseInfo?.createdAt,
      endAt: now,
    };
  }

  if (tabStatus === "preparing") {
    return {
      startAt: getPurchaseStageDate(purchaseInfo, "preparing"),
      endAt: getPurchaseStageDate(purchaseInfo, "shipping") || now,
    };
  }

  if (tabStatus === "shipping") {
    return {
      startAt: getPurchaseStageDate(purchaseInfo, "shipping"),
      endAt: getPurchaseStageDate(purchaseInfo, "shipped") || now,
    };
  }

  if (tabStatus === "shipped" || tabStatus === "send") {
    return {
      startAt: getPurchaseStageDate(purchaseInfo, "shipping") || getPurchaseStageDate(purchaseInfo, "paid"),
      endAt: getPurchaseStageDate(purchaseInfo, "shipped"),
    };
  }

  if (tabStatus === "not-send") {
    return {
      startAt: getPurchaseStageDate(purchaseInfo, "paid") || purchaseInfo?.createdAt,
      endAt: getPurchaseStageDate(purchaseInfo, "not-send"),
    };
  }

  return { startAt: null, endAt: null };
}

export function getPurchaseProcessingDurationMs(purchaseInfo, tabStatus) {
  const { startAt, endAt } = getPurchaseStageDurationBounds(purchaseInfo, tabStatus);
  if (!startAt || !endAt) return null;

  const start = new Date(startAt);
  const end = new Date(endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const diffMs = end.getTime() - start.getTime();
  return diffMs >= 0 ? diffMs : null;
}

export function formatDurationFa(diffMs) {
  if (diffMs == null) return "—";

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days.toLocaleString("fa-IR")} روز`);
  if (hours > 0) parts.push(`${hours.toLocaleString("fa-IR")} ساعت`);
  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes.toLocaleString("fa-IR")} دقیقه`);
  }

  return parts.join(" و ");
}

export function getPurchaseProcessingDurationLabel(tabStatus) {
  if (tabStatus === "shipped" || tabStatus === "send") return "مدت تا ارسال";
  if (tabStatus === "shipping") return "مدت در حال ارسال";
  if (tabStatus === "preparing") return "مدت در آماده‌سازی";
  if (tabStatus === "not-send") return "مدت تا رد";
  if (tabStatus === "pending") return "مدت در انتظار";
  return "مدت بررسی";
}

export function formatPurchaseProcessingDuration(purchaseInfo, tabStatus) {
  return formatDurationFa(getPurchaseProcessingDurationMs(purchaseInfo, tabStatus));
}
