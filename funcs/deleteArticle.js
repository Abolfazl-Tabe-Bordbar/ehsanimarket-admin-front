import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function deleteArticle(id) {
  try {
    const { data } = await axios.delete(`${baseUrl}/articles/${id}`, {
      headers: { cookies: getCookie("ramian-pakhsh-admin") },
    });

    if (data.status) {
      Swal.fire({ icon: "success", title: data.message });
    } else {
      Swal.fire({ icon: "error", title: data.message });
    }
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default deleteArticle;
