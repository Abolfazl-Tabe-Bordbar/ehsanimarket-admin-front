import { uploadUrl } from "@/data/variables";

export const testimonialTypeLabels = {
  person: "شخص",
  business: "کسب‌وکار",
};

export function getTestimonialTypeLabel(type) {
  return testimonialTypeLabels[type] || "شخص";
}

export function getTestimonialImageUrl(item) {
  if (!item?.image_file) return "";
  const base = `${uploadUrl}/testimonials/${item.image_file}`;
  if (!item?.updatedAt) return base;
  return `${base}?v=${new Date(item.updatedAt).getTime()}`;
}
