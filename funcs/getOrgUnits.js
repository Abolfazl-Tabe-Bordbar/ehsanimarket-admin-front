import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getOrgUnits(token) {
  try {
    const res = await fetch(`${baseUrl}/org-units`, {
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

export default getOrgUnits;
