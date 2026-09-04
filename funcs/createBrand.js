import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

function appendBrandFields(formData, data) {
  formData.append("name", data.name);

  if (data.logo && typeof data.logo === "object") {
    formData.append("logo", data.logo);
  }
}

async function createBrand(data) {
  try {
    const formData = new FormData();
    appendBrandFields(formData, data);

    const { data: res } = await axios.post(`${baseUrl}/brands`, formData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    if (res.status) {
      Swal.fire({ icon: "success", title: res.message }).then(() => window.location.reload());
    } else {
      Swal.fire({ icon: "error", title: res.message });
    }
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default createBrand;
