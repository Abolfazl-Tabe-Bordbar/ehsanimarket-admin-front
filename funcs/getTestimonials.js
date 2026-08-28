import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getTestimonials(token) {
  try {
    const res = await fetch(`${baseUrl}/testimonials`, {
      headers: {
        cookies: token,
      },
    });
    return await res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getTestimonials;
