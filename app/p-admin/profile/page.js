import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getMyAdminProfile from "@/funcs/getMyAdminProfile";
import AdminProfileClient from "@/components/templates/P-Admin/Profile/AdminProfileClient";

export const metadata = {
  title: "احسانی مارکت - پروفایل من",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getMyAdminProfile(token?.value);

  if (!data?.status || !data?.data) {
    redirect("/p-admin/dashboard");
  }

  return <AdminProfileClient initialProfile={data.data} />;
}

export default page;