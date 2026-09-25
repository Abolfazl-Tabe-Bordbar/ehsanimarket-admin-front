"use client";
import React, { useState } from "react";
import FestivalsList from "./FestivalsList";
import FestivalFormPanel from "./FestivalFormPanel";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  const [formState, setFormState] = useState(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const closeForm = () => setFormState(null);

  const handleSaved = () => {
    closeForm();
    setListRefreshKey((key) => key + 1);
  };

  const openCreate = () => setFormState({ mode: "create" });

  const openEdit = (festival) => setFormState({ mode: "edit", festival });

  const editingId = formState?.mode === "edit" ? formState.festival?.id : null;

  return (
    <AdminPageShell
      title="جشنواره"
      description="ارسال رایگان برای شهرهای منتخب وقتی مبلغ سبد به حد تعیین‌شده برسد"
      actions={
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => {
            if (formState?.mode === "create") {
              closeForm();
              return;
            }
            openCreate();
          }}
        >
          {formState?.mode === "create" ? "بستن فرم ایجاد" : "ایجاد جشنواره جدید"}
        </button>
      }
    >
      {formState ? (
        <FestivalFormPanel
          key={formState.mode === "edit" ? `edit-${formState.festival.id}` : "create"}
          festival={formState.mode === "edit" ? formState.festival : undefined}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      ) : null}

      <FestivalsList
        data={data}
        refreshKey={listRefreshKey}
        editingId={editingId}
        onEdit={openEdit}
      />
    </AdminPageShell>
  );
}

export default Main;
