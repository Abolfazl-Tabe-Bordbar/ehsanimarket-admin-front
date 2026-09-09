import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function adjustProductStock(productId, delta) {
  try {
    const { data } = await axios.patch(
      `${baseUrl}/products/${productId}/stock`,
      { delta },
      {
        headers: {
          cookies: getCookie("ramian-pakhsh-admin"),
        },
      }
    );

    if (data.status) {
      const actionLabel = delta > 0 ? "افزایش" : "کاهش";
      const countLabel =
        data.body?.count !== undefined
          ? Number(data.body.count).toLocaleString("fa-IR")
          : null;

      TopRightToast.fire({
        icon: "success",
        title: `${actionLabel} موجودی با موفقیت انجام شد`,
        text: countLabel ? `موجودی فعلی: ${countLabel}` : data.message,
      });
    } else {
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
    return { status: false };
  }
}

export default adjustProductStock;
