import React from "react";
import {
  formatPurchaseDateTime,
  getPurchaseStageTimeline,
} from "./purchaseHelpers";

function PurchaseStageTimeline({ purchaseInfo, compact = false }) {
  const timeline = getPurchaseStageTimeline(purchaseInfo);

  if (!timeline.length) return null;

  return (
    <div
      className={`rounded-xl border border-gray-100 bg-gray-50/70 ${
        compact ? "px-3 py-2.5" : "px-4 py-3"
      }`}
    >
      <p className="text-[11px] font-bold text-gray-500 mb-2">زمان‌بندی مراحل</p>
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "md:gap-3"}`}>
        {timeline.map((stage) => (
          <div
            key={stage.key}
            className="inline-flex items-center gap-2 rounded-lg border border-white bg-white px-2.5 py-1.5 text-xs shadow-sm"
          >
            <span className="font-bold text-brand-navy">{stage.label}</span>
            <span className="text-gray-600">{formatPurchaseDateTime(stage.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PurchaseStageTimeline;
