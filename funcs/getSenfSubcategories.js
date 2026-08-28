import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getSenfSubcategories(token, senfId) {
    try {
        const res = await fetch(`${baseUrl}/subcategories/${senfId}`, {
          headers: {
            cookies: token,
          },
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

export default getSenfSubcategories