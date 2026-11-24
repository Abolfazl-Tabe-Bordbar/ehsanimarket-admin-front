export const STATUS_OPTIONS = [
  { value: "open", label: "ثبت‌شده", className: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "in_progress", label: "در حال بررسی", className: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "waiting_customer", label: "منتظر پاسخ مشتری", className: "bg-violet-50 text-violet-700 border-violet-200" },
  { value: "resolved", label: "بسته‌شده", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "کم", className: "bg-gray-100 text-gray-600" },
  { value: "normal", label: "عادی", className: "bg-sky-50 text-sky-700" },
  { value: "high", label: "زیاد", className: "bg-orange-50 text-orange-700" },
  { value: "urgent", label: "فوری", className: "bg-red-50 text-red-700" },
];

export const statusOf = (value) => STATUS_OPTIONS.find((item) => item.value === value) || STATUS_OPTIONS[0];
export const priorityOf = (value) => PRIORITY_OPTIONS.find((item) => item.value === value) || PRIORITY_OPTIONS[1];

export const fa = (value) => Number(value || 0).toLocaleString("fa-IR");
export const faId = (value) => Number(value || 0).toLocaleString("fa-IR", { useGrouping: false });

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// دقیقه => «۲ ساعت و ۱۵ دقیقه»
export function formatDuration(minutes) {
  if (minutes === null || minutes === undefined) return "—";
  const total = Math.max(0, Math.round(minutes));
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const mins = total % 60;
  const parts = [];
  if (days) parts.push(`${fa(days)} روز`);
  if (hours) parts.push(`${fa(hours)} ساعت`);
  if (mins || !parts.length) parts.push(`${fa(mins)} دقیقه`);
  return parts.slice(0, 2).join(" و ");
}

export function StatusBadge({ status }) {
  const item = statusOf(status);
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${item.className}`}>
      {item.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const item = priorityOf(priority);
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ${item.className}`}>
      {item.label}
    </span>
  );
}
