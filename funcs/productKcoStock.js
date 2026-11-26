import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function productKcoStockRequest(productId, method, pathSuffix) {
  try {
    const { data } = await axios({
      method,
      url: `${baseUrl}/products/${productId}/${pathSuffix}`,
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });
    return data;
  } catch {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return { status: false };
  }
}

export function inquiryProductKcoStock(productId) {
  return productKcoStockRequest(productId, "get", "kco-stock-inquiry");
}

export function applyProductKcoStock(productId) {
  return productKcoStockRequest(productId, "post", "kco-stock-apply");
}