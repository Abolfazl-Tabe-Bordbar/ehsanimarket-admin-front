"use client";

import React from "react";
import MessageFormPanel from "./MessageFormPanel";

function AddMessagePanel({ onClose, onSuccess }) {
  return (
    <MessageFormPanel
      mode="add"
      title="افزودن پیام تأیید"
      submitLabel="ثبت پیام"
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

export default AddMessagePanel;
