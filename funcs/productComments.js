import { baseUrl } from "@/data/variables";
import getCookie from "@/funcs/cookies/getCookie";

function authHeaders() {
  return { cookies: getCookie("ramian-pakhsh-admin") };
}

export async function getProductComments(productId) {
  const res = await fetch(
    `${baseUrl}/products/comments/list?product_id=${productId}`,
    { headers: authHeaders() }
  );
  return res.json();
}

export async function approveProductComment(commentId) {
  const res = await fetch(`${baseUrl}/products/comments/${commentId}/approve`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return res.json();
}

export async function deleteProductComment(commentId) {
  const res = await fetch(`${baseUrl}/products/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function replyProductComment(commentId, body) {
  const res = await fetch(`${baseUrl}/products/comments/${commentId}/reply`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
  return res.json();
}
