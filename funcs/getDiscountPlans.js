import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getDiscountPlans(token) {
  try {
    const res = await fetch(`${baseUrl}/discount_plans`, {
      headers: {
        cookies: token,
      },
    });
    const resData = await res.json();
    
    return resData;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getDiscountPlans;
