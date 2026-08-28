import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getNewsletterSubscribers(token) {
  try {
    const res = await fetch(`${baseUrl}/newsletter`, {
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
    return { status: false, data: [] };
  }
}

export default getNewsletterSubscribers;
