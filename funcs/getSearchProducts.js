import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function getSearchProducts(searchValue, page, limit) {
  try {
    const { data } = await axios.post(
      `${baseUrl}/products/search?limit=${limit}&page=${page}`,
      searchValue,
      {
        headers: {
          cookies: getCookie("ramian-pakhsh-admin"),
        },
      }
    );

    if (!data.status) {
      TopRightToast.fire({
        icon: "error",
        title: data.message,
      });
    }

    return data
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getSearchProducts;
