"use client";
import React, { useEffect, useMemo, useState } from "react";
import RateBox from "./RateBox";
import getShippingRates from "@/funcs/getShippingRates";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";
import AdminSearchBar from "@/components/admin/ui/AdminSearchBar";
import { getProvinceNames } from "@/data/iranLocations";

function RateList({ data, refreshKey = 0 }) {
  const [shownData, setShownData] = useState(data);
  const [provinceFilter, setProvinceFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const provinceOptions = useMemo(() => getProvinceNames(), []);

  const getRatesHandler = () => {
    getShippingRates(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  useEffect(() => {
    if (refreshKey > 0) {
      getRatesHandler();
    }
  }, [refreshKey]);

  const filteredRates = useMemo(() => {
    const rates = shownData?.body || [];
    const q = searchQuery.trim();

    return rates.filter((rate) => {
      if (provinceFilter && rate.province_name !== provinceFilter) {
        return false;
      }
      if (q) {
        const cityMatch = rate.city_name?.includes(q);
        const provinceMatch = rate.province_name?.includes(q);
        if (!cityMatch && !provinceMatch) return false;
      }
      return true;
    });
  }, [shownData, provinceFilter, searchQuery]);

  const hasActiveFilters = Boolean(provinceFilter || searchQuery.trim());
  const hasAnyRates = Boolean(shownData?.body?.length);

  const clearFilters = () => {
    setProvinceFilter("");
    setSearchInput("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-5">
      <AdminSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={(value) => setSearchQuery(value.trim())}
        onClear={() => {
          setSearchInput("");
          setSearchQuery("");
        }}
        placeholder="جستجو بر اساس نام شهر یا استان..."
      />

      <div className="admin-section">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="shipping-province-filter" className="block text-xs font-bold text-gray-600 mb-2">
              استان
            </label>
            <select
              id="shipping-province-filter"
              className="admin-input"
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
            >
              <option value="">همه استان‌ها</option>
              {provinceOptions.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button type="button" className="admin-btn-secondary !py-2.5 shrink-0" onClick={clearFilters}>
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>

      <div className="my-2">
        {!hasAnyRates ? (
          <EmptyMessage text="هنوز نرخ پستی برای هیچ شهری ثبت نشده است." />
        ) : !filteredRates.length ? (
          <EmptyMessage text="شهری با این فیلتر یافت نشد." />
        ) : (
          <>
            {hasActiveFilters && (
              <p className="text-xs text-gray-500 mb-4">
                {filteredRates.length.toLocaleString("fa-IR")} شهر یافت شد
              </p>
            )}
            <div className="admin-list">
              {filteredRates.map((rate) => (
                <RateBox key={rate.id} {...rate} getRatesHandler={getRatesHandler} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RateList;
