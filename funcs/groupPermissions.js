const PERMISSION_GROUPS = {
  admins: { label: "ادمین‌ها", order: 0 },
  category: { label: "دسته‌بندی", order: 1 },
  product: { label: "محصولات", order: 2 },
  banner: { label: "بنرها", order: 3 },
  users: { label: "کاربران", order: 4 },
  orders: { label: "سفارشات", order: 5 },
  faq: { label: "سوالات متداول", order: 6 },
  messages: { label: "پیام‌ها", order: 7 },
  discount_plans: { label: "تخفیف‌ها", order: 8 },
  articles: { label: "مقالات", order: 9 },
  testimonials: { label: "نظرات مشتریان", order: 10 },
  brands: { label: "برندها", order: 11 },
  user: { label: "تگ و پیامک کاربران", order: 12 },
};

export function getPermissionGroupKey(name = "") {
  if (name.startsWith("discount_plans")) return "discount_plans";
  if (name.startsWith("user_tags") || name.startsWith("user_sms")) return "user";
  const prefix = name.split("_")[0];
  return PERMISSION_GROUPS[prefix] ? prefix : "other";
}

export function getPermissionActionLabel(description = "") {
  const actions = ["مشاهده", "افزودن", "ویرایش", "حذف", "مدیریت"];
  for (const action of actions) {
    if (description.startsWith(action)) return action;
  }
  return description;
}

export function groupPermissions(permissions = []) {
  const grouped = {};

  for (const permission of permissions) {
    const key = getPermissionGroupKey(permission.name);
    if (!grouped[key]) {
      grouped[key] = {
        key,
        label: PERMISSION_GROUPS[key]?.label || "سایر",
        order: PERMISSION_GROUPS[key]?.order ?? 99,
        items: [],
      };
    }
    grouped[key].items.push(permission);
  }

  return Object.values(grouped).sort((a, b) => a.order - b.order);
}
