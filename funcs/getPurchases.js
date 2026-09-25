import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getPurchases(token, page, limit, statusAfterPaid, rejectionReasonId = null) {
  try {
    let url = `${baseUrl}/orders?page=${page}&limit=${limit}&status_after_paid=${statusAfterPaid}`;
    if (rejectionReasonId) {
      url += `&rejection_reason_id=${rejectionReasonId}`;
    }

    const res = await fetch(url, {
      headers: {
        cookies: token,
      },
      cache: "no-store",
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
