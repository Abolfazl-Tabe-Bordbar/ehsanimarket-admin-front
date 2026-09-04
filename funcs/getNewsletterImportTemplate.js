import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function getNewsletterImportTemplate() {
  try {
    const response = await axios.get(`${baseUrl}/newsletter/import-template`, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
      responseType: "blob",
    });

    if (response.data?.type?.includes("application/json")) {
      const text = await response.data.text();
      const payload = JSON.parse(text);
      TopRightToast.fire({
        icon: "error",
        title: payload.message || "خطا در دریافت فایل نمونه",
      });
      return { status: false };
    }

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const linkElem = document.createElement("a");
    linkElem.href = url;
    linkElem.download = "newsletter_import_template.xlsx";
    linkElem.click();
    window.URL.revokeObjectURL(url);

    return { status: true };
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: error?.response?.status === 404
        ? "مسیر دانلود نمونه در API یافت نشد. API را restart کنید."
        : "خطایی رخ داده است. دوباره تلاش کنید",
    });

    return { status: false };
  }
}

export default getNewsletterImportTemplate;
