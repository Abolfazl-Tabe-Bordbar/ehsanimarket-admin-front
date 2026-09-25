import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function importProductsInventoryExcel(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(`${baseUrl}/products/import-inventory`, formData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
        "Content-Type": "multipart/form-data",
      },
    });

    const title =
      data.message === "This route is not in my api"
        ? "مسیر import در API فعال نیست. سرور API را restart کنید."
        : data.message;
    TopRightToast.fire({
      icon: data.status ? "success" : "error",
      title,
    });

    return data;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default importProductsInventoryExcel;
