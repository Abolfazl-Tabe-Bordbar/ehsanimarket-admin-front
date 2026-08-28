import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function uploadArticleMedia(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(`${baseUrl}/articles/upload-media`, formData, {
      headers: { cookies: getCookie("ramian-pakhsh-admin") },
    });

    if (!data.status) {
      TopRightToast.fire({ icon: "error", title: data.message || "خطا در آپلود" });
      return null;
    }

    return data;
  } catch (error) {
    TopRightToast.fire({ icon: "error", title: "خطا در آپلود فایل" });
    return null;
  }
}

export default uploadArticleMedia;
