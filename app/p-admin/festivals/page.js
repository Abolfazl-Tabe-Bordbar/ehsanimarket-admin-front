import React from "react";
import Main from "@/components/templates/P-Admin/Festivals/Main";
import { cookies } from "next/headers";
import getFestivals from "@/funcs/getFestivals";

export const metadata = {
  title: "احسانی مارکت - جشنواره",
};

async function FestivalsPage() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getFestivals(token?.value);

  return <Main data={data} />;
}

export default FestivalsPage;
