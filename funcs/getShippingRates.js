import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function getShippingRates(token) {
  try {
    const res = await fetch(`${baseUrl}/city-shipping-rates`, {
      headers: {
        cookies: token,
      },
    });
    return res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getShippingRates;
