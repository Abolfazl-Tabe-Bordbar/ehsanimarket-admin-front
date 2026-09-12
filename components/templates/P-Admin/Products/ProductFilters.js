"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getSenfSubcategories from "@/funcs/getSenfSubcategories";
import getCookie from "@/funcs/cookies/getCookie";

function ProductFilters({ asnaf = [], brands = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [senfSubcategories, setSenfSubcategories] = useState([]);
  const selectedSenf = searchParams.get("senf") || "";
  const selectedSubcategory = searchParams.get("subcategory") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const selectedStock = searchParams.get("stock") || "";
  const selectedDiscount = searchParams.get("discount") || "";
  const pendingCommentsOnly = searchParams.get("pending_comments") === "yes";

  useEffect(() => {
    if (!selectedSenf) {
      setSenfSubcategories([]);
      return;
    }

    getSenfSubcategories(getCookie("ramian-pakhsh-admin"), selectedSenf).then(
      (res) => setSenfSubcategories(res?.body || [])
    );
  }, [selectedSenf]);

  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("p", "1");
    router.push(`/p-admin/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    params.set("p", "1");
    router.push(`/p-admin/products?${params.toString()}`);
  };

  const hasFilters =
    selectedSenf ||
    selectedSubcategory ||
    selectedBrand ||
    selectedStock ||
    selectedDiscount ||
    pendingCommentsOnly;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 space-y-4">
      {pendingCommentsOnly && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2.5">
          <p className="text-sm text-red-700 font-medium">
            فقط محصولات دارای نظر تایید‌نشده نمایش داده می‌شوند
          </p>
          <button
            type="button"
            onClick={() => updateFilters({ pending_comments: "" })}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            حذف فیلتر
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="filter-senf" className="block text-xs font-bold text-gray-600">
            دسته
          </label>
          <select
            id="filter-senf"
            value={selectedSenf}
            onChange={(e) =>
              updateFilters({
                senf: e.target.value,
                subcategory: "",
              })
            }
            className="admin-input w-full !rounded-xl"
          >
            <option value="">همه دسته‌ها</option>
            {asnaf.map((senf) => (
              <option key={senf.id} value={senf.id}>
                {senf.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-subcategory" className="block text-xs font-bold text-gray-600">
            زیردسته
          </label>
          <select
            id="filter-subcategory"
            value={selectedSubcategory}
            disabled={!selectedSenf}
            onChange={(e) => updateFilters({ subcategory: e.target.value })}
            className="admin-input w-full !rounded-xl disabled:opacity-50"
          >
            <option value="">همه زیردسته‌ها</option>
            {senfSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-brand" className="block text-xs font-bold text-gray-600">
            برند
          </label>
          <select
            id="filter-brand"
            value={selectedBrand}
            onChange={(e) => updateFilters({ brand: e.target.value })}
            className="admin-input w-full !rounded-xl"
          >
            <option value="">همه برندها</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-stock" className="block text-xs font-bold text-gray-600">
            موجودی
          </label>
          <select
            id="filter-stock"
            value={selectedStock}
            onChange={(e) => updateFilters({ stock: e.target.value })}
            className="admin-input w-full !rounded-xl"
          >
            <option value="">همه</option>
            <option value="in">موجود</option>
            <option value="out">ناموجود</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-discount" className="block text-xs font-bold text-gray-600">
            تخفیف
          </label>
          <select
            id="filter-discount"
            value={selectedDiscount}
            onChange={(e) => updateFilters({ discount: e.target.value })}
            className="admin-input w-full !rounded-xl"
          >
            <option value="">همه</option>
            <option value="yes">دارای تخفیف</option>
            <option value="no">بدون تخفیف</option>
          </select>
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-brand-gold"
        >
          پاک کردن فیلترها
        </button>
      )}
    </div>
  );
}

export default ProductFilters;
