"use client";

import SimpleListManager from "./SimpleListManager";
import { deleteCannedReply, getCannedReplies, saveCannedReply } from "@/funcs/support";
import { fa } from "./supportHelpers";

const FIELDS = [
  { key: "title", label: "عنوان (برای انتخاب سریع)", type: "text", max: 80, placeholder: "مثلاً: درخواست عکس کالا" },
  { key: "body", label: "متن پاسخ", type: "textarea", max: 3000 },
  { key: "sort_order", label: "ترتیب نمایش", type: "number", placeholder: "خودکار" },
];

function CannedReplies() {
  return (
    <SimpleListManager
      title="پاسخ‌های آماده"
      itemLabel="پاسخ آماده"
      fields={FIELDS}
      load={getCannedReplies}
      save={(form, id) =>
        saveCannedReply(
          {
            title: String(form.title || "").trim(),
            body: String(form.body || "").trim(),
            sort_order: form.sort_order === "" ? undefined : form.sort_order,
          },
          id
        )
      }
      remove={deleteCannedReply}
      columns={["ترتیب", "عنوان", "متن"]}
      renderCells={(item) => (
        <>
          <td className="text-xs text-gray-400">{fa(item.sort_order)}</td>
          <td className="whitespace-nowrap font-medium text-gray-800">{item.title}</td>
          <td className="max-w-[420px]"><p className="line-clamp-2 text-sm text-gray-600">{item.body}</p></td>
        </>
      )}
    />
  );
}

export default CannedReplies;
