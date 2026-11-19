import { baseUrl } from "@/data/variables";
import { TopRightToast } from "@/components/modules/Toast";

// درخواست‌ها از پروکسی پنل عبور می‌کنند و توکن مدیر سمت سرور اضافه می‌شود
async function request(path, options = {}, { toast = false } = {}) {
  try {
    const res = await fetch(`${baseUrl}${path}`, { cache: "no-store", ...options });
    const data = await res.json();
    if (toast && data?.message) {
      TopRightToast.fire({ icon: data.status ? "success" : "error", title: data.message });
    }
    return data;
  } catch {
    if (toast) TopRightToast.fire({ icon: "error", title: "خطایی رخ داده است. دوباره تلاش کنید" });
    return { status: false };
  }
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const query = (params = {}) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, value);
  }
  const text = search.toString();
  return text ? `?${text}` : "";
};

export const getTickets = (params) => request(`/tickets${query(params)}`);
export const getTicketSummary = () => request("/tickets/summary");
export const getAdminTicket = (id) => request(`/tickets/${id}`);
export const updateTicket = (id, body) => request(`/tickets/${id}`, json("PUT", body), { toast: true });
export const replyAdminTicket = (id, formData) =>
  request(`/tickets/${id}/messages`, { method: "POST", body: formData }, { toast: true });
export const adminTicketFileUrl = (ticketId, fileName) =>
  `${baseUrl}/tickets/${ticketId}/files/${encodeURIComponent(fileName)}`;

export const getSupportAgents = () => request("/support/agents");
export const getSupportReports = (params) => request(`/support/reports${query(params)}`);

export const getTicketCategories = () => request("/support/categories");
export const saveTicketCategory = (body, id) =>
  request(id ? `/support/categories/${id}` : "/support/categories", json(id ? "PUT" : "POST", body), { toast: true });
export const deleteTicketCategory = (id) => request(`/support/categories/${id}`, { method: "DELETE" }, { toast: true });

export const getCannedReplies = () => request("/support/canned-replies");
export const saveCannedReply = (body, id) =>
  request(id ? `/support/canned-replies/${id}` : "/support/canned-replies", json(id ? "PUT" : "POST", body), { toast: true });
export const deleteCannedReply = (id) => request(`/support/canned-replies/${id}`, { method: "DELETE" }, { toast: true });
