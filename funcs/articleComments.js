import { baseUrl } from "@/data/variables";
import getCookie from "@/funcs/cookies/getCookie";

function authHeaders() {
  return { cookies: getCookie("ramian-pakhsh-admin") };
}

export async function getArticleComments(articleId) {
  const res = await fetch(
    `${baseUrl}/articles/comments/list?article_id=${articleId}`,
    { headers: authHeaders() }
  );
  return res.json();
}

export async function approveArticleComment(commentId) {
  const res = await fetch(`${baseUrl}/articles/comments/${commentId}/approve`, {
    method: "PUT",
    headers: authHeaders(),
  });
  return res.json();
}

export async function deleteArticleComment(commentId) {
  const res = await fetch(`${baseUrl}/articles/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function replyArticleComment(commentId, body) {
  const res = await fetch(`${baseUrl}/articles/comments/${commentId}/reply`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
  return res.json();
}
