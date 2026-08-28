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
