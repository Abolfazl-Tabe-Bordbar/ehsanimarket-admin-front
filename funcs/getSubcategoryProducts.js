import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function getSubcategoryProducts(categoryIds) {
  try {
    const { data } = await axios.get(`${baseUrl}/subcategories/products/all`, {
      params: {
        c: categoryIds,
      },
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    return data;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getSubcategoryProducts;
