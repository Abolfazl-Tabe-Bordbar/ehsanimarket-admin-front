import axios from "axios";
import { baseUrl } from "@/data/variables";
import setCookie from "./cookies/setCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function login(loginData, router) {
  try {
    const { data } = await axios.post(`${baseUrl}/login`, loginData, {
      timeout: 15000,
    });
    if (!data.status) {
      TopRightToast.fire({
        icon: "error",
        title: data.message || "چنین مدیری در سایت موجود نیست",
      });
      return false;
    }

    const isSecure =
      typeof window !== "undefined" && window.location.protocol === "https:";

    setCookie("ramian-pakhsh-admin", data.token, {
      secure: isSecure,
      "max-age": 3600 * 24 * 7,
    });
    router.push("/p-admin/dashboard");
    return true;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title:
        error?.code === "ECONNABORTED"
          ? "اتصال به سرور برقرار نشد. API لوکال را بررسی کنید."
          : "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return false;
  }
}

export default login;
