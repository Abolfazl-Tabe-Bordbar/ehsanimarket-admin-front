import axios from "axios";
import { baseUrl } from "@/data/variables";
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

    // توکن را route پروکسی در کوکی HttpOnly ذخیره کرده است
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
