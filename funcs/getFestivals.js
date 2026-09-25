import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getFestivals(token) {
  try {
    const res = await fetch(`${baseUrl}/festivals`, {
      headers: {
        cookies: token,
      },
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getFestivals;
