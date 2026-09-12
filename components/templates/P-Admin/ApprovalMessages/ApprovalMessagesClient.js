"use client";

import React, { useState } from "react";
import MessageList from "./MessageList";
import AddMessagePanel from "./AddMessagePanel";
import { orderMessageStageConfig } from "../Purchases/purchaseHelpers";

function ApprovalMessagesClient({ data, stage = "approve" }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const stageConfig = orderMessageStageConfig[stage] || orderMessageStageConfig.approve;

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
          {isAddOpen ? "بستن فرم" : stageConfig.addLabel}
        </button>
      </div>

      {isAddOpen ? (
        <AddMessagePanel
          stage={stage}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleSuccess}
        />
      ) : null}

      <MessageList
        data={data}
        stage={stage}
        refreshKey={refreshKey}
        emptyText={stageConfig.emptyText}
      />
    </>
  );
}

export default ApprovalMessagesClient;
