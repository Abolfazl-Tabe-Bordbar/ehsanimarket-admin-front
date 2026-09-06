"use client";
import React from "react";
import ReasonFormPanel from "./ReasonFormPanel";

function AddReasonPanel({ onClose, onSuccess }) {
  return (
    <ReasonFormPanel
      mode="add"
      title="افزودن دلیل رد"
      submitLabel="ثبت دلیل"
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

export default AddReasonPanel;
