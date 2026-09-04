"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UsersTable from "./UsersTable";
import EmptyMessage from "@/components/modules/EmptyMessage";
import AdminSearchBar from "@/components/admin/ui/AdminSearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import getUsers from "@/funcs/getUsers";
import exportUsersExcel from "@/funcs/exportUsersExcel";
import CustomPagination from "@/components/modules/CustomPagination";
import getCookie from "@/funcs/cookies/getCookie";
import Loader from "@/components/modules/Loader";
import { getCitiesByProvince, getProvinceNames } from "@/data/iranLocations";
import { apiBaseUrl } from "@/data/variables";

function buildFilterQuery(province, city, q) {
  const params = new URLSearchParams();
  if (province) params.set("province", province);
  if (city) params.set("city", city);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `&${query}` : "";
}

function UsersList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const requestIdRef = useRef(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  const itemsPerPage = 10;
  const currentPage = Math.max(1, Number(searchParams.get("p")) || 1);
  const provinceFilter = searchParams.get("province") || "";
  const cityFilter = searchParams.get("city") || "";
  const searchValue = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(searchValue);
  const totalPages = Math.max(1, Math.ceil((shownData?.countAll || 0) / itemsPerPage));

  const provinceOptions = useMemo(() => getProvinceNames(), []);
  const cityOptions = useMemo(
    () => (provinceFilter ? getCitiesByProvince(provinceFilter) : []),
    [provinceFilter]
  );

  const paginationQuery = buildFilterQuery(provinceFilter, cityFilter, searchValue);

  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  const currentFilters = useMemo(
    () => ({
      province: provinceFilter,
      city: cityFilter,
      q: searchValue,
    }),
    [provinceFilter, cityFilter, searchValue]
  );

  const loadUsers = useCallback(
    async (page, filters) => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);

      try {
        const res = await getUsers(
          getCookie("ramian-pakhsh-admin"),
          page - 1,
          itemsPerPage,
          filters
        );

        if (requestId !== requestIdRef.current) return;
        if (res) setShownData(res);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [itemsPerPage]
  );

  const pushFiltersToUrl = (page, province, city, q) => {
    const params = new URLSearchParams();
    params.set("p", String(page));
    if (province) params.set("province", province);
    if (city) params.set("city", city);
    if (q?.trim()) params.set("q", q.trim());
    router.push(`/p-admin/users?${params.toString()}`);
  };

  const updateFilter = (key, value) => {
    const nextProvince = key === "province" ? value : provinceFilter;
    const nextCity = key === "province" ? "" : key === "city" ? value : cityFilter;
    const nextFilters = {
      province: nextProvince,
      city: nextCity,
      q: searchValue,
    };

    pushFiltersToUrl(1, nextProvince, nextCity, searchValue);
    loadUsers(1, nextFilters);
  };

  const searchHandler = (value) => {
    pushFiltersToUrl(1, provinceFilter, cityFilter, value.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("/p-admin/users?p=1");
    loadUsers(1, { province: "", city: "", q: "" });
  };

  const exportHandler = () => {
    setIsExporting(true);
    exportUsersExcel({
      province: provinceFilter,
      city: cityFilter,
      q: searchValue.trim() || undefined,
    })
      .then((res) => {
        if (res?.file) {
          const linkElem = document.createElement("a");
          linkElem.href = `${apiBaseUrl}${res.file}`;
          linkElem.download = "";
          linkElem.click();
        }
      })
      .finally(() => setIsExporting(false));
  };

  useEffect(() => {
    loadUsers(currentPage, currentFilters);
  }, [currentPage, currentFilters, loadUsers]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil((shownData?.countAll || 0) / itemsPerPage));
    if ((shownData?.countAll || 0) > 0 && currentPage > maxPage) {
      pushFiltersToUrl(maxPage, provinceFilter, cityFilter, searchValue);
    }
  }, [shownData?.countAll, currentPage, provinceFilter, cityFilter, searchValue, itemsPerPage]);

  const hasActiveFilters = Boolean(provinceFilter || cityFilter || searchValue.trim());

  return (
    <div className="space-y-5">
      {(isExporting || isLoading) && <Loader />}

      <AdminSearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={searchHandler}
        onClear={() => searchHandler("")}
        placeholder="جستجو در نام، شماره تماس یا نام کاربری..."
      />

      <div className="admin-section">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div>
              <label htmlFor="province-filter" className="block text-xs font-bold text-gray-600 mb-2">
                استان
              </label>
              <select
                id="province-filter"
                className="admin-input"
                value={provinceFilter}
                onChange={(e) => updateFilter("province", e.target.value)}
              >
                <option value="">همه استان‌ها</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city-filter" className="block text-xs font-bold text-gray-600 mb-2">
                شهر
              </label>
              <select
                id="city-filter"
                className="admin-input"
                value={cityFilter}
                disabled={!provinceFilter}
                onChange={(e) => updateFilter("city", e.target.value)}
              >
                <option value="">همه شهرها</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {hasActiveFilters && (
              <button type="button" className="admin-btn-secondary" onClick={clearFilters}>
                پاک کردن فیلتر
              </button>
            )}
            <button type="button" className="admin-btn-success" onClick={exportHandler}>
              خروجی اکسل
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          {shownData?.countAll ?? 0} کاربر
          {hasActiveFilters ? " (با فیلتر فعال)" : ""}
        </p>
      </div>

      {!shownData?.status || !shownData?.body?.length ? (
        <EmptyMessage
          text={
            hasActiveFilters
              ? "کاربری با این فیلتر یا جستجو پیدا نشد."
              : "هنوز کاربری ثبت‌نام نکرده است."
          }
        />
      ) : (
        <>
          <UsersTable
            users={shownData.body}
            startIndex={(currentPage - 1) * itemsPerPage}
          />
          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              extraQuery={paginationQuery}
            />
          )}
        </>
      )}
    </div>
  );
}

export default UsersList;
