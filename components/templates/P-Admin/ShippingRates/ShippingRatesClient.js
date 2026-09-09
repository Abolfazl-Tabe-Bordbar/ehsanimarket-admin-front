"use client";
import React, { useState } from "react";
import RateList from "./RateList";
import AddRatePanel from "./AddRatePanel";
import BulkRatePanel from "./BulkRatePanel";

function ShippingRatesClient({ data }) {
  const [activePanel, setActivePanel] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <p className="text-sm text-gray-500 hidden sm:block">
          شهرها را بر اساس استان فیلتر کنید یا نام شهر را جستجو کنید
        </p>
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            className={`admin-btn-secondary !py-2 !px-4 text-sm ${activePanel === "bulk" ? "!bg-brand-navy !text-white" : ""}`}
            onClick={() => togglePanel("bulk")}
          >
            {activePanel === "bulk" ? "بستن تعریف گروهی" : "تعریف گروهی"}
          </button>
          <button
            type="button"
            className="admin-btn-primary !py-2 !px-4 text-sm"
            onClick={() => togglePanel("add")}
          >
            {activePanel === "add" ? "بستن فرم" : "افزودن شهر"}
          </button>
        </div>
      </div>

      {activePanel === "bulk" ? (
        <BulkRatePanel
          onClose={() => setActivePanel(null)}
          onSuccess={handleSuccess}
        />
      ) : null}

      {activePanel === "add" ? (
        <AddRatePanel onClose={() => setActivePanel(null)} onSuccess={handleSuccess} />
      ) : null}

      <RateList data={data} refreshKey={refreshKey} />
    </>
  );
}

export default ShippingRatesClient;
