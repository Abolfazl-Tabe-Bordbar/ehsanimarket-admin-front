import { baseUrl } from "@/data/variables";
import { TopRightToast } from "@/components/modules/Toast";

async function request(path, options = {}, { toast = false } = {}) {
  try {
    const res = await fetch(`${baseUrl}${path}`, { cache: "no-store", ...options });
    const data = await res.json();
    if (toast && data?.message) TopRightToast.fire({ icon: data.status ? "success" : "error", title: data.message });
    return data;
  } catch {
    if (toast) TopRightToast.fire({ icon: "error", title: "خطایی رخ داده است. دوباره تلاش کنید" });
    return { status: false, message: "خطایی رخ داده است. دوباره تلاش کنید" };
  }
}

export const getKcoSettings = () => request("/kco/settings");
export const saveKcoSettings = (token) =>
  request("/kco/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }, { toast: true });
