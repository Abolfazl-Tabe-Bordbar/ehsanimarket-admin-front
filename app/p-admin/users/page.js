import React from "react";
import { cookies } from "next/headers";
import Main from "@/components/templates/P-Admin/Users/Main";
import getUsers from "@/funcs/getUsers";

export const metadata = {
  title: "احسانی مارکت - کاربران سایت",
};

async function Users({ searchParams }) {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const params = await searchParams;

  const data = await getUsers(
    token?.value,
    Number(params.p) ? Number(params.p) - 1 : 0,
    10,
    {
      province: params.province,
      city: params.city,
    }
  );

  return <Main data={data} />;
}

export default Users;
