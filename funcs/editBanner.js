import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function editBanner(bannerData, bannerId) {
  try {
    const formData = new FormData();
    formData.append("image", bannerData.image);
    formData.append("section", bannerData.section);
    formData.append("link", bannerData.link);
    formData.append("page", bannerData.page);
    formData.append("device", bannerData.device);
    formData.append("change_image", bannerData.change_image);

    const { data } = await axios.put(
      `${baseUrl}/baners/${bannerId}`,
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

export default editBanner