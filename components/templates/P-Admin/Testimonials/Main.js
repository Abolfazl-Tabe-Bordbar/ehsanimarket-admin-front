import React from "react";
import AddTestimonialButton from "./AddTestimonialButton";
import TestimonialsList from "./TestimonialsList";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  return (
    <AdminPageShell
      title="نظرات شما"
      description="مدیریت نظرات مشتریان و کسب‌وکارها برای نمایش در صفحه اصلی"
      actions={<AddTestimonialButton />}
    >
      <TestimonialsList data={data} />
    </AdminPageShell>
  );
}

export default Main;
