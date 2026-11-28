import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getCustomerClassesAdmin(token) {
  try {
    const res = await fetch(`${baseUrl}/customer-classes`, {
      headers: { cookies: token },
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getCustomerClassesAdmin;