export const bannerPages = [
  { value: "home", label: "صفحه خانه" },
  { value: "shop", label: "صفحه محصولات" },
];

export const bannerPageLabels = {
  home: "صفحه خانه",
  shop: "صفحه محصولات",
};

export const bannerSectionLabels = {
  header: "هدر",
  hero: "میانه",
  footer: "فوتر",
};

export const bannerDeviceLabels = {
  mobile: "موبایل",
  tablet: "تبلت",
  laptop: "تبلت به بالا",
};

export const bannerDeviceBreakpoints = {
  mobile: "عرض کمتر از ۶۴۰px",
  tablet: "عرض ۶۴۰ تا ۷۶۷px",
  laptop: "عرض ۷۶۸px به بالا",
};

export const bannerGuideSections = {
  home: [
    { section: "header", label: "هدر", display: "اسلایدر بالای صفحه" },
    { section: "hero", label: "میانه", display: "۲ بنر کنار هم (دسکتاپ/تبلت)" },
    { section: "footer", label: "فوتر", display: "۲ بنر کنار هم (دسکتاپ/تبلت)" },
  ],
  shop: [
    { section: "header", label: "هدر", display: "۱ بنر بالای لیست محصولات" },
    { section: "footer", label: "فوتر", display: "۲ بنر پایین لیست محصولات" },
  ],
};

export const bannerDesignSizes = [
  {
    title: "بنر بالایی (هدر) — اسلایدر",
    rows: [
      { device: "موبایل", ratio: "۱۶:۹", size: "720 × 405 px" },
      { device: "تبلت", ratio: "۱۶:۹", size: "1024 × 576 px" },
      { device: "تبلت به بالا", ratio: "۳:۱", size: "1440 × 480 px" },
    ],
  },
  {
    title: "بنر میانه و پایین — دو تایی",
    rows: [
      { device: "موبایل", ratio: "۱۶:۹", size: "720 × 405 px (تک ستونه)" },
      { device: "تبلت", ratio: "۲:۱", size: "512 × 256 px (هر بنر)" },
      { device: "تبلت به بالا", ratio: "۲:۱", size: "700 × 350 px (هر بنر)" },
    ],
  },
  {
    title: "صفحه محصولات — بنر هدر",
    rows: [
      { device: "موبایل", ratio: "—", size: "720 × 400 px" },
      { device: "تبلت", ratio: "—", size: "1024 × 400 px" },
      { device: "تبلت به بالا", ratio: "—", size: "1440 × 400 px" },
    ],
  },
];

export const bannerAdminRules = [
  "برای هر بنر، صفحه، مکان و دستگاه را دقیق انتخاب کنید.",
  "هر بنر فقط روی همان دستگاهی که برایش آپلود شده نمایش داده می‌شود.",
  "بنر موبایل فقط روی موبایل، بنر تبلت فقط روی تبلت، بنر تبلت به بالا فقط روی دسکتاپ.",
  "برای نمایش در هر سایز، باید بنر همان دستگاه را جداگانه آپلود کنید.",
  "بخش میانه صفحه خانه: ترجیحاً ۲ بنر برای هر دستگاه بگذارید.",
  "لینک مقصد هر بنر را حتماً پر کنید.",
  "فرمت JPG یا PNG — حجم ترجیحاً زیر 150KB.",
  "متن و لوگوی مهم وسط تصویر باشد؛ گوشه‌ها ممکن است بریده شوند.",
];

export function getBannerPageLabel(page) {
  return bannerPageLabels[page] || "نامشخص";
}

export function getBannerSectionLabel(section) {
  return bannerSectionLabels[section] || section;
}

export function getBannerDeviceLabel(device) {
  return bannerDeviceLabels[device] || device;
}

export function groupBannersByPage(banners = []) {
  const groups = bannerPages.map((page) => ({
    ...page,
    items: banners.filter((banner) => banner.page === page.value),
  }));

  const unknown = banners.filter(
    (banner) => !bannerPages.some((page) => page.value === banner.page)
  );

  if (unknown.length) {
    groups.push({
      value: "other",
      label: "سایر",
      items: unknown,
    });
  }

  return groups;
}
