import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function getDiscountSubcategories() {
  try {
    const { data } = await axios.get(`${baseUrl}/subcategories/haveDiscount`, {
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

export default getDiscountSubcategories;
