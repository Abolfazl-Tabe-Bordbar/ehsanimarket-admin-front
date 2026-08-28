"use client";

import React, { useMemo, useState } from "react";
import EmptyMessage from "@/components/modules/EmptyMessage";
import getCookie from "@/funcs/cookies/getCookie";
import BannerBox from "./BannerBox";
import getBanners from "@/funcs/getBanners";
import {
  bannerPages,
  getBannerPageLabel,
  groupBannersByPage,
} from "@/components/admin/bannerConfig";

function BannersList({ data }) {
  const [shownData, setShownData] = useState(data);
  const [activePage, setActivePage] = useState("all");

  const banners = shownData?.data || [];
  const groupedBanners = useMemo(() => groupBannersByPage(banners), [banners]);

  const pageCounts = useMemo(() => {
    const counts = { all: banners.length };
    groupedBanners.forEach((group) => {
      counts[group.value] = group.items.length;
    });
    return counts;
  }, [banners, groupedBanners]);

  const getBannersHandler = () => {
    getBanners(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  const renderBannerGroup = (group) => (
    <section key={group.value} className="space-y-3">
      {activePage === "all" && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm md:text-base font-bold text-brand-navy">
            {group.label}
          </h2>
          <span className="text-xs text-gray-500">
            {group.items.length.toLocaleString("fa-IR")} بنر
          </span>
        </div>
      )}
      {group.items.length ? (
        <div className="admin-list">
          {group.items.map((banner) => (
            <BannerBox
              key={banner.id}
              getBannersHandler={getBannersHandler}
              {...banner}
            />
          ))}
        </div>
      ) : (
        <EmptyMessage text={`بنری برای ${group.label} ثبت نشده است.`} />
      )}
    </section>
  );

  const visibleGroups =
    activePage === "all"
      ? groupedBanners
      : groupedBanners.filter((group) => group.value === activePage);

  const hasAnyBanner = banners.length > 0;

  return (
    <div className="mt-6 space-y-6">
      <div className="admin-tabs">
        <button
          type="button"
          onClick={() => setActivePage("all")}
          className={`admin-tab ${activePage === "all" ? "admin-tab-active" : ""}`}
        >
          همه ({pageCounts.all.toLocaleString("fa-IR")})
        </button>
        {bannerPages.map((page) => (
          <button
            key={page.value}
            type="button"
            onClick={() => setActivePage(page.value)}
            className={`admin-tab ${activePage === page.value ? "admin-tab-active" : ""}`}
          >
            {page.label} ({(pageCounts[page.value] || 0).toLocaleString("fa-IR")})
          </button>
        ))}
      </div>

      {!shownData?.status || !hasAnyBanner ? (
        <EmptyMessage text="هیچ بنری ثبت نشده است." />
      ) : activePage === "all" ? (
        <div className="space-y-8">
          {visibleGroups.map((group) => renderBannerGroup(group))}
        </div>
      ) : visibleGroups.length ? (
        renderBannerGroup(visibleGroups[0])
      ) : (
        <EmptyMessage
          text={`بنری برای ${getBannerPageLabel(activePage)} ثبت نشده است.`}
        />
      )}
    </div>
  );
}

export default BannersList;
