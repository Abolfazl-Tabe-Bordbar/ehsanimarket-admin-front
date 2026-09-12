import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getUserSmsBroadcasts(token, page = 0, limit = 10) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const res = await fetch(`${baseUrl}/user-sms/broadcasts?${params.toString()}`, {
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

export default getUserSmsBroadcasts;
