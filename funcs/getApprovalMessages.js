import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getApprovalMessages(token) {
  try {
    const res = await fetch(`${baseUrl}/order-approval-messages`, {
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
