import React from "react";
import { cookies } from "next/headers";
import getTestimonials from "@/funcs/getTestimonials";
import Main from "@/components/templates/P-Admin/Testimonials/Main";

export const metadata = {
  title: "احسانی مارکت - نظرات شما",
};

async function TestimonialsPage() {
  const token = (await cookies()).get("ramian-pakhsh-admin");
  const data = await getTestimonials(token?.value);

  return <Main data={data} />;
}

export default TestimonialsPage;
