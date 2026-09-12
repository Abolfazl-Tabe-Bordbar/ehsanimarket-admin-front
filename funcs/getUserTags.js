import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getUserTags(token) {
  try {
    const res = await fetch(`${baseUrl}/user-tags`, {
      headers: { cookies: token },
    });
    return await res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getUserTags;
