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

export const getHubraSettings = () => request("/hubra/settings");
export const saveHubraSettings = (token) =>
  request("/hubra/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }, { toast: true });
export const getHubraAccount = (refresh = false) => request(`/hubra/account${refresh ? "?refresh=1" : ""}`);
export const getHubraUsage = () => request("/hubra/usage");
export const searchHubraProducts = (q) => request(`/hubra/products?q=${encodeURIComponent(q)}`);
export const getHubraBroadcasts = (page = 1) => request(`/hubra/broadcasts?page=${page}`);
export const getHubraBroadcast = (ulid) => request(`/hubra/broadcasts/${ulid}`);
export const sendHubraBroadcast = (formData) =>
  request("/hubra/broadcasts", { method: "POST", body: formData }, { toast: true });
