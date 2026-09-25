"use client";

import { useEffect, useState } from "react";
import { formatPurchaseProcessingDuration } from "./purchaseHelpers";

const LIVE_DURATION_STATUSES = new Set(["pending", "preparing", "shipping"]);

function PurchaseProcessingDurationValue({ purchaseInfo, tabStatus }) {
  const [value, setValue] = useState("—");

  useEffect(() => {
    const update = () => {
      setValue(formatPurchaseProcessingDuration(purchaseInfo, tabStatus));
    };

    update();

    if (!LIVE_DURATION_STATUSES.has(tabStatus)) return undefined;

    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [purchaseInfo, tabStatus]);

  return value;
}

export default PurchaseProcessingDurationValue;
