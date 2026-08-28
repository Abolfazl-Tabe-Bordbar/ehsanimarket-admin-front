"use client";

import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

function PersianDateField({ value, onChange, placeholder = "انتخاب تاریخ" }) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      value={value}
      onChange={(date) => onChange(date?.toDate?.() || null)}
      placeholder={placeholder}
      inputClass="admin-input"
      containerStyle={{ width: "100%" }}
      calendarPosition="bottom-center"
    />
  );
}

export default PersianDateField;
