import React from "react";
import Link from "next/link";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import ApprovalMessagesClient from "./ApprovalMessagesClient";
import { orderMessageStageConfig } from "../Purchases/purchaseHelpers";

const tabs = [
  { key: "approve", label: "تایید" },
  { key: "preparing", label: "آماده‌سازی" },
  { key: "shipping", label: "ارسال" },
];

function Main({ data, stage = "approve" }) {
  const stageConfig = orderMessageStageConfig[stage] || orderMessageStageConfig.approve;

  return (
    <AdminPageShell
      title={stageConfig.title}
      description={stageConfig.description}
    >
      <div className="admin-tabs flex-wrap mb-4">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/p-admin/approval-messages?stage=${tab.key}`}
            className={`admin-tab ${stage === tab.key ? "admin-tab-active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <ApprovalMessagesClient data={data} stage={stage} />
    </AdminPageShell>
  );
}

export default Main;
