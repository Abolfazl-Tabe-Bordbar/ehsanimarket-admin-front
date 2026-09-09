"use client";
import React from "react";
import RateFormPanel from "./RateFormPanel";

function AddRatePanel({ onClose, onSuccess }) {
  return (
    <RateFormPanel
      mode="add"
      title="افزودن نرخ پست شهر"
      submitLabel="ثبت نرخ"
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

export default AddRatePanel;
