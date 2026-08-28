import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getPurchases(token, page, limit, statusAfterPaid) {
  try {
    const res = await fetch(`${baseUrl}/orders?page=${page}&limit=${limit}&status_after_paid=${statusAfterPaid}`, {
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

export default getPurchases;
