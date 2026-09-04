import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";
import { buildProductsApiQuery } from "@/components/templates/P-Admin/Products/productFilterHelpers";

async function getProducts(token, page, limit, filters = {}) {
  try {
    const filterQuery = buildProductsApiQuery(filters);
    const url = `${baseUrl}/products?page=${page}&limit=${limit}${
      filterQuery ? `&${filterQuery}` : ""
    }`;

    const res = await fetch(url, {
      headers: {
        cookies: token,
      },
      cache: "no-store",
    });
    const resData = await res.json();

    return resData;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getProducts;
