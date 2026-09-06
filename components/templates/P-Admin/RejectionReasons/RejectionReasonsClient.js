"use client";
import React, { useState } from "react";
import ReasonList from "./ReasonList";
import AddReasonPanel from "./AddReasonPanel";

function RejectionReasonsClient({ data }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setIsAddOpen((prev) => !prev)}
        >
          {isAddOpen ? "بستن فرم" : "افزودن دلیل رد"}
        </button>
      </div>

      {isAddOpen ? (
        <AddReasonPanel
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleSuccess}
        />
      ) : null}

      <ReasonList data={data} refreshKey={refreshKey} />
    </>
  );
}

export default RejectionReasonsClient;
