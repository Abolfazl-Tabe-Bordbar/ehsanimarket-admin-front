import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function editAdminPhone(phoneData, phoneId) {
  try {
    const { data } = await axios.put(`${baseUrl}/admins_phone/${phoneId}`, phoneData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    TopRightToast.fire({
      icon: data.status ? "success" : "error",
      title: data.message,
    });
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default editAdminPhone;
