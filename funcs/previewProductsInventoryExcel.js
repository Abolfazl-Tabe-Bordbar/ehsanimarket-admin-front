import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";

async function previewProductsInventoryExcel(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(`${baseUrl}/products/import-inventory/preview`, formData, {
    headers: {
      cookies: getCookie("ramian-pakhsh-admin"),
      "Content-Type": "multipart/form-data",
    },
  });

  if (data?.message === "This route is not in my api") {
    return {
      status: false,
      message: "مسیر preview در API فعال نیست. سرور API را restart کنید.",
    };
  }

  return data;
}

export default previewProductsInventoryExcel;
