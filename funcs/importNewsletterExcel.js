import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function importNewsletterExcel(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(`${baseUrl}/newsletter/import`, formData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
        "Content-Type": "multipart/form-data",
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

export default importNewsletterExcel;
