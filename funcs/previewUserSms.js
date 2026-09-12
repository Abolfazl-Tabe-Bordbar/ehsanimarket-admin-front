import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function previewUserSms(payload) {
  try {
    const { data } = await axios.post(`${baseUrl}/user-sms/preview`, payload, {
      headers: { cookies: getCookie("ramian-pakhsh-admin") },
    });

    if (!data.status) {
      TopRightToast.fire({ icon: "error", title: data.message });
    }

    return data;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return { status: false };
  }
}

export default previewUserSms;
