import { uploadUrl } from "@/data/variables";

export function getBrandLogoUrl(brand) {
  if (!brand?.logo_file) return "";
  return `${uploadUrl}/brands/${brand.logo_file}`;
}
