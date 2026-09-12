import React from "react";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import UserTagsClient from "@/components/templates/P-Admin/UserTags/UserTagsClient";
import getUserTags from "@/funcs/getUserTags";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - تگ‌های کاربران",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const tagsData = await getUserTags(token?.value);

  return (
    <AdminPageShell
      title="تگ‌های کاربران"
      description="تعریف تگ با رنگ و توضیح برای دسته‌بندی کاربران"
    >
      <UserTagsClient initialTags={tagsData?.body || []} />
    </AdminPageShell>
  );
}

export default page;
