"use client";

import SimpleListManager from "./SimpleListManager";
import { deleteTicketCategory, getTicketCategories, saveTicketCategory } from "@/funcs/support";
import { fa } from "./supportHelpers";

const FIELDS = [
  { key: "title", label: "عنوان موضوع", type: "text", max: 60, placeholder: "مثلاً: مرجوعی کالا" },
  { key: "sort_order", label: "ترتیب نمایش", type: "number", placeholder: "خودکار" },
  { key: "requires_order", label: "مشتری باید سفارش مربوطه را انتخاب کند", type: "checkbox", default: false },
  { key: "is_active", label: "در فرم ثبت تیکت نمایش داده شود", type: "checkbox", default: true },
];

function TicketCategories() {
  return (
    <SimpleListManager
      title="موضوعات تیکت"
      itemLabel="موضوع"
      fields={FIELDS}
      load={getTicketCategories}
      save={(form, id) =>
        saveTicketCategory(
          {
            title: String(form.title || "").trim(),
            sort_order: form.sort_order === "" ? undefined : form.sort_order,
            requires_order: Boolean(form.requires_order),
            is_active: Boolean(form.is_active),
          },
          id
        )
      }
      remove={deleteTicketCategory}
      columns={["ترتیب", "عنوان", "نیاز به سفارش", "وضعیت"]}
      renderCells={(item) => (
        <>
          <td className="text-xs text-gray-400">{fa(item.sort_order)}</td>
          <td className="font-medium text-gray-800">{item.title}</td>
          <td className="text-xs">{item.requires_order ? "بله" : "خیر"}</td>
          <td>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
              {item.is_active ? "فعال" : "غیرفعال"}
            </span>
          </td>
        </>
      )}
    />
  );
}

export default TicketCategories;
