import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function saveWarehouse(payload, id = null) {
  try {
    const url = id ? `${baseUrl}/warehouses/${id}` : `${baseUrl}/warehouses`;
    const method = id ? "put" : "post";
    const { data } = await axios[method](url, payload, {
      headers: { cookies: getCookie("ramian-pakhsh-admin") },
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

export default saveWarehouse;