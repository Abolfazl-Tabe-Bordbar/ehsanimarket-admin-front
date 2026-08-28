import axios from "axios";
import { baseUrl } from "@/data/variables";
import setCookie from "./cookies/setCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function login(loginData, router) {
  try {
    const { data } = await axios.post(`${baseUrl}/login`, loginData);
    if (!data.status) {
      TopRightToast.fire({
        icon: "error",
        title: "چنین مدیری در سایت موجود نیست",
      });
      return false;
    } else {
      setCookie("ramian-pakhsh-admin", data.token, {
        secure: true,
        "max-age": 3600 * 24 * 7,
      });
      router.push("/p-admin/dashboard");
      return false;
    }
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default login;
