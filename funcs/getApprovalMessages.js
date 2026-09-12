import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getApprovalMessages(token, stage = "") {
  try {
    const query = stage ? `?stage=${encodeURIComponent(stage)}` : "";
    const res = await fetch(`${baseUrl}/order-approval-messages${query}`, {
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

export default getApprovalMessages;
