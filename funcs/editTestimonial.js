import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function editTestimonial(data, id) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("subtitle", data.subtitle || "");
    formData.append("text", data.text);
    formData.append("sort_order", data.sort_order ?? 0);
    formData.append("is_active", data.is_active ? "1" : "0");
    formData.append("change_image", String(data.change_image ?? 0));

    if (data.image && typeof data.image === "object") {
      formData.append("image", data.image);
    }

    const { data: res } = await axios.put(`${baseUrl}/testimonials/${id}`, formData, {
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

export default editTestimonial;
