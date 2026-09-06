export const purchaseTabStatusConfig = {
  pending: {
    label: "در انتظار بررسی",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    emptyMessage: "هنوز تایید یا رد نشده است",
  },
  send: {
    label: "ارسال‌شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    emptyMessage: "پیامی ثبت نشده",
  },
  "not-send": {
    label: "ارسال نشده",
    className: "bg-red-50 text-red-700 border-red-200",
    emptyMessage: "دلیل رد ثبت نشده",
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
