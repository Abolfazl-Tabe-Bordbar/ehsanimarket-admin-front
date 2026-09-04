import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import { buildProductsApiQuery } from "@/components/templates/P-Admin/Products/productFilterHelpers";

async function getSearchProducts(searchValue, page, limit, filters = {}) {
  try {
    const filterQuery = buildProductsApiQuery(filters);
    const url = `${baseUrl}/products/search?limit=${limit}&page=${page}${
      filterQuery ? `&${filterQuery}` : ""
    }`;

    const { data } = await axios.post(url, searchValue, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    if (!data.status) {
      TopRightToast.fire({
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

export default getSearchProducts;
