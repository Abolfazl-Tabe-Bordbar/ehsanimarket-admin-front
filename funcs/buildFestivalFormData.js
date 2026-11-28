export function buildFestivalFormData(
  payload,
  { panelImageFile = null, removePanelImage = false } = {}
) {
  if (payload.type !== "amazing") {
    return payload;
  }

  const formData = new FormData();
  const scalarKeys = [
    "name",
    "description",
    "type",
    "discount_percent",
    "min_cart_amount",
    "starts_at",
    "ends_at",
    "exact_time",
    "is_active",
    "amazing_panel_color",
    "amazing_panel_color_2",
  ];

  for (const key of scalarKeys) {
    const value = payload[key];
    if (value === undefined || value === null || value === "") continue;
    formData.append(
      key,
      value instanceof Date ? value.toISOString() : String(value)
    );
  }

  formData.append("product_ids", JSON.stringify(payload.product_ids || []));
  formData.append("city_names", JSON.stringify(payload.city_names || []));
  if (payload.product_discounts) {
    formData.append("product_discounts", JSON.stringify(payload.product_discounts));
  }
  formData.append("exact_time", String(payload.exact_time ?? true));
  formData.append("is_active", String(Boolean(payload.is_active)));

  if (panelImageFile) {
    formData.append("amazing_panel_image", panelImageFile);
  }
  if (removePanelImage) {
    formData.append("remove_amazing_panel_image", "true");
  }

  return formData;
}