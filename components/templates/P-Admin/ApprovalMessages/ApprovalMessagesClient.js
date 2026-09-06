"use client";

import React, { useState } from "react";
import MessageList from "./MessageList";
import AddMessagePanel from "./AddMessagePanel";

function ApprovalMessagesClient({ data }) {
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
          {isAddOpen ? "بستن فرم" : "افزودن پیام تأیید"}
        </button>
      </div>

      {isAddOpen ? (
        <AddMessagePanel onClose={() => setIsAddOpen(false)} onSuccess={handleSuccess} />
      ) : null}

      <MessageList data={data} refreshKey={refreshKey} />
    </>
  );
}

export default ApprovalMessagesClient;
