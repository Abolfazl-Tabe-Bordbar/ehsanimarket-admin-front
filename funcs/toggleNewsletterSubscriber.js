import axios from "axios";
import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";
import getCookie from "@/funcs/cookies/getCookie";

async function toggleNewsletterSubscriber(id) {
  try {
    const { data } = await axios.put(`${baseUrl}/newsletter/${id}/toggle`, null, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    TopRightToast.fire({
      icon: data.status ? "success" : "error",
      title: data.message,
    });

    return data;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return { status: false };
  }
}

export default toggleNewsletterSubscriber;
