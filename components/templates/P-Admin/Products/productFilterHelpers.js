export function buildProductsFilterQuery(searchParams) {
  const keys = ["senf", "subcategory", "brand", "stock", "discount", "pending_comments", "q"];
  const params = new URLSearchParams();

  keys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  });

  const query = params.toString();
  return query ? `&${query}` : "";
}

export function getProductsFiltersFromParams(searchParams) {
  return {
    senf_id: searchParams.get("senf") || "",
    subcategory_id: searchParams.get("subcategory") || "",
    brand_id: searchParams.get("brand") || "",
    stock: searchParams.get("stock") || "",
    discount: searchParams.get("discount") || "",
    pending_comments: searchParams.get("pending_comments") || "",
    q: searchParams.get("q") || "",
  };
}

export function hasActiveProductFilters(filters) {
  return Boolean(
    filters.senf_id ||
      filters.subcategory_id ||
      filters.brand_id ||
      filters.stock ||
      filters.discount ||
      filters.pending_comments ||
      filters.q
  );
}

export function buildProductsApiQuery(filters = {}) {
  const params = new URLSearchParams();

  if (filters.senf_id) params.set("senf_id", filters.senf_id);
  if (filters.subcategory_id) params.set("subcategory_id", filters.subcategory_id);
  if (filters.brand_id) params.set("brand_id", filters.brand_id);
  if (filters.stock) params.set("stock", filters.stock);
  if (filters.discount) params.set("discount", filters.discount);
  if (filters.pending_comments) params.set("pending_comments", filters.pending_comments);

  return params.toString();
}
