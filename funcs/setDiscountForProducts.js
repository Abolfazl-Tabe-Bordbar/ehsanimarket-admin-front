import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function setDiscountForProducts(products) {
  try {
    const { data } = await axios.put(`${baseUrl}/products`, products, {
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

    return data;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default setDiscountForProducts;
