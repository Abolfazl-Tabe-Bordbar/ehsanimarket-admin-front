import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import ShippingRatesClient from "./ShippingRatesClient";

function Main({ data }) {
  return (
    <AdminPageShell
      title="هزینه پست شهرها"
      description="تعریف هزینه پست بر اساس وزن سفارش برای هر شهر — امکان تعریف گروهی برای کل استان"
    >
      <div className="mb-4 text-sm text-gray-600 leading-7 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <p className="font-bold text-brand-navy mb-2">نحوه محاسبه هزینه پست</p>
        <ul className="list-disc pr-5 space-y-1.5 mb-3">
          <li>
            <strong>زیر ۱ کیلو:</strong> پست رایگان
          </li>
          <li>
            <strong>۱ تا ۳ کیلو:</strong> فقط هزینهٔ پلن ۱
          </li>
          <li>
            <strong>بین ۳ تا ۶ کیلو:</strong> هزینه پلن ۲ (بیشتر از ۳ کیلو)
          </li>
          <li>
            <strong>۶ کیلو به بالا:</strong> همان مبلغ «پلن ۱ + پلن ۲» — هزینهٔ سوم اضافه نمی‌شود
          </li>
        </ul>
        <p className="text-xs text-gray-500 border-t border-blue-100 pt-2">
          مثال: پلن ۱ = ۱۰۰٬۰۰۰ و پلن ۲ = ۳۰۰٬۰۰۰ ← ۲ کیلو: ۱۰۰٬۰۰۰ | ۵ کیلو: ۴۰۰٬۰۰۰ | ۱۰ کیلو: ۴۰۰٬۰۰۰
        </p>
      </div>
      <ShippingRatesClient data={data} />
    </AdminPageShell>
  );
}

export default Main;
