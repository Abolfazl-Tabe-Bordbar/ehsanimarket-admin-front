import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getAsnaf(token) {
  try {
    const res = await fetch(
      `${baseUrl}/categories`,
      {
        headers: {
          cookies: token,
        },
      }
    );
    const resData = await res.json();

    return resData;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getAsnaf;
