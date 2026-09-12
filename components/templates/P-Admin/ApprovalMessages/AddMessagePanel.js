"use client";

import React from "react";
import MessageFormPanel from "./MessageFormPanel";

function AddMessagePanel({ stage = "approve", onClose, onSuccess }) {
  return (
    <MessageFormPanel
      mode="add"
      stage={stage}
      title="افزودن پیام"
      submitLabel="ثبت پیام"
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

export default AddMessagePanel;
