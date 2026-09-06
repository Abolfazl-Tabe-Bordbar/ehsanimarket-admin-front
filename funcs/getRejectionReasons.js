import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getRejectionReasons(token) {
  try {
    const res = await fetch(`${baseUrl}/order-rejection-reasons`, {
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

export default getRejectionReasons;
