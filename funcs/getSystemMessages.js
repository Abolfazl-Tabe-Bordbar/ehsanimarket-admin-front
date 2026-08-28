import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getSystemMessages(token) {
  try {
    const res = await fetch(`${baseUrl}/system_messages`, {
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

export default getSystemMessages;
