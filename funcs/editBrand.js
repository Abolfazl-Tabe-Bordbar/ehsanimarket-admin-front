import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function editBrand(data, id) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("change_image", String(data.change_image ?? 0));

    if (data.logo && typeof data.logo === "object") {
      formData.append("logo", data.logo);
    }

    const { data: res } = await axios.put(`${baseUrl}/brands/${id}`, formData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    if (res.status) {
      Swal.fire({ icon: "success", title: res.message }).then(() => window.location.reload());
    } else {
      Swal.fire({ icon: "error", title: res.message });
    }

    return res;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default editBrand;
