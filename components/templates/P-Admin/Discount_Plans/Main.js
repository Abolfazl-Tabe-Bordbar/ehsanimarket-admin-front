import React from "react";
import DiscountsList from "@/components/templates/P-Admin/Discount_Plans/DiscountsList";
import AddDiscountButton from "@/components/templates/P-Admin/Discount_Plans/AddDiscountButton";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="پلن‌های تخفیف"
      description="تعریف پلن‌های تخفیف"
      actions={<AddDiscountButton />}
    >
      <DiscountsList data={data} />
    </AdminPageShell>
  );
}

export default Main;
