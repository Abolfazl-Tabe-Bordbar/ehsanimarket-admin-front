import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function editSenf(senfData, senfId) {
  try {
    const formData = new FormData();
    formData.append("image", senfData.image);
    formData.append("name", senfData.name);
    formData.append("change_image", senfData.change_image);

    const { data } = await axios.put(
      `${baseUrl}/categories/${senfId}`,
      formData,
      {
        headers: {
          cookies: getCookie("ramian-pakhsh-admin"),
        },
      }
    );

    TopRightToast.fire({
      icon: data.status ? "success" : "error",
      title: data.message,
    })
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default editSenf;
