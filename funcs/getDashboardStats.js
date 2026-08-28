import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getDashboardStats(token) {
  try {
    const res = await fetch(`${baseUrl}/dashboard/stats`, {
      headers: { cookies: token },
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی در دریافت آمار داشبورد رخ داد",
    });
    return { status: false };
  }
}

export default getDashboardStats;
