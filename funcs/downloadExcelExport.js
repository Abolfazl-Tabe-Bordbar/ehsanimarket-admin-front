import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

function getFilenameFromHeader(header, fallback) {
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header || "");
  return match ? decodeURIComponent(match[1]) : fallback;
}

/**
 * فایل اکسل خروجی را مستقیم از API (از طریق پروکسی احراز هویت‌شده) دانلود می‌کند.
 * فایل دیگر در پوشه عمومی سرور ذخیره نمی‌شود.
 */
async function downloadExcelExport(path, body = {}, fallbackName = "export.xlsx") {
  try {
    const response = await axios.post(`${baseUrl}${path}`, body, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
      responseType: "blob",
    });

    // خطاها همچنان به شکل JSON برمی‌گردند
    if (response.data?.type?.includes("application/json")) {
      const payload = JSON.parse(await response.data.text());
      TopRightToast.fire({
        icon: "error",
        title: payload.message || "خطا در ساخت فایل خروجی",
      });
      return { status: false, message: payload.message };
    }

    const filename = getFilenameFromHeader(
      response.headers?.["content-disposition"],
      fallbackName
    );
    const url = window.URL.createObjectURL(response.data);
    const linkElem = document.createElement("a");
    linkElem.href = url;
    linkElem.download = filename;
    document.body.appendChild(linkElem);
    linkElem.click();
    linkElem.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);

    TopRightToast.fire({
      icon: "success",
      title: "فایل خروجی با موفقیت ساخته شد",
    });

    return { status: true };
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return { status: false };
  }
}

export default downloadExcelExport;
