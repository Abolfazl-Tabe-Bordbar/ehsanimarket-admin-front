import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function getProductsInventoryImportTemplate() {
  try {
    const response = await axios.get(`${baseUrl}/products/import-inventory/template`, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
      responseType: "blob",
    });

    if (response.data?.type?.includes("application/json")) {
      const text = await response.data.text();
      const payload = JSON.parse(text);
      const title =
        payload.message === "This route is not in my api"
          ? "مسیر در API فعال نیست. سرور API (پورت 4000) را restart کنید."
          : payload.message || "خطا در دریافت فایل نمونه";
      TopRightToast.fire({
        icon: "error",
        title,
      });
      return { status: false };
    }

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const linkElem = document.createElement("a");
    linkElem.href = url;
    linkElem.download = "products_inventory_template.xlsx";
    linkElem.click();
    window.URL.revokeObjectURL(url);

    return { status: true };
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title:
        error?.response?.status === 404
          ? "مسیر دانلود نمونه در API یافت نشد. API را restart کنید."
          : "خطایی رخ داده است. دوباره تلاش کنید",
    });

    return { status: false };
  }
}

export default getProductsInventoryImportTemplate;
