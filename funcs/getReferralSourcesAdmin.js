import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getReferralSourcesAdmin(token) {
  try {
    const res = await fetch(`${baseUrl}/referral-sources`, {
      headers: { cookies: token },
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getReferralSourcesAdmin;
