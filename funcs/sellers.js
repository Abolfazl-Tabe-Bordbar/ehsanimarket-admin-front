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

const json = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const getSellers = () => request("/sellers");
export const createSeller = (body) => request("/sellers", json("POST", body), { toast: true });
export const updateSeller = (id, body) => request(`/sellers/${id}`, json("PUT", body), { toast: true });
export const setSellerPassword = (id, password) => request(`/sellers/${id}/password`, json("POST", { password }), { toast: true });
export const deleteSeller = (id) => request(`/sellers/${id}`, { method: "DELETE" }, { toast: true });
export const getSellerOrders = (id, page = 1) => request(`/sellers/${id}/orders?page=${page}`);
