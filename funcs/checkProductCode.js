import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";

async function checkProductCode(code) {
  try {
    const { data } = await axios.get(`${baseUrl}/products/check-code`, {
      params: { code },
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });
    return data;
  } catch (error) {
    return (
      error?.response?.data || {
        status: false,
        message: "خطا در ارتباط با سرور. API را بررسی کنید.",
      }
    );
  }
}

export default checkProductCode;
