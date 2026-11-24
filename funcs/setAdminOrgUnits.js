import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function setAdminOrgUnits(adminId, unitIds) {
  try {
    const { data } = await axios.put(
      `${baseUrl}/admin/${adminId}/org-units`,
      { unit_ids: unitIds },
      { headers: { cookies: getCookie("ramian-pakhsh-admin") } }
    );

    TopRightToast.fire({
      icon: data.status ? "success" : "error",
      title: data.message,
    });

    return data;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return { status: false };
  }
}

export default setAdminOrgUnits;
