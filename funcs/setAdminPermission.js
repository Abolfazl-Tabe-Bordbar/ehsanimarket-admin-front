import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function setAdminPermission(permissionData) {
  try {
    const { data } = await axios.post(`${baseUrl}/set_permission`, permissionData, {
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
  }
}

export default setAdminPermission;
