import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function createBanner(bannerData) {
  try {
    const formData = new FormData();
    formData.append("image", bannerData.image);
    formData.append("section", bannerData.section);
    formData.append("link", bannerData.link);
    formData.append("page", bannerData.page);
    formData.append("device", bannerData.device);

    const { data } = await axios.post(`${baseUrl}/baners`, formData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    if (data.status) {
      Swal.fire({
        icon: "success",
        title: data.message,
      }).then(() => window.location.reload());
    } else {
      Swal.fire({
        icon: "error",
        title: data.message,
      });
    }
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default createBanner;
