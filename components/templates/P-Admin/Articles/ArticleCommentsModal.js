"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import {
  approveArticleComment,
  deleteArticleComment,
  getArticleComments,
  replyArticleComment,
} from "@/funcs/articleComments";

function ArticleCommentsModal({ article, onClose, onCommentsChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});

  const loadComments = async () => {
    setLoading(true);
    const res = await getArticleComments(article.id);
    setComments(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [article.id]);

  const notifyChange = () => {
    if (onCommentsChange) onCommentsChange();
  };

  const handleApprove = async (commentId) => {
    const res = await approveArticleComment(commentId);
    Swal.fire({ icon: res.status ? "success" : "error", title: res.message });
    if (res.status) {
      loadComments();
      notifyChange();
    }
  };

  const handleDelete = async (commentId) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "حذف این نظر؟",
      showCancelButton: true,
      confirmButtonText: "حذف",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;

    const res = await deleteArticleComment(commentId);
    Swal.fire({ icon: res.status ? "success" : "error", title: res.message });
    if (res.status) {
      loadComments();
      notifyChange();
    }
  };

  const handleReply = async (commentId) => {
    const body = (replyDrafts[commentId] || "").trim();
    if (body.length < 2) return;

    const res = await replyArticleComment(commentId, body);
    Swal.fire({ icon: res.status ? "success" : "error", title: res.message });
    if (res.status) {
      setReplyDrafts((prev) => ({ ...prev, [commentId]: "" }));
      loadComments();
    }
  };

  return (
    <div className="admin-modal-overlay items-center">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="font-bold text-base">نظرات مقاله</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{article.title}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 px-2">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <Loader />
          ) : !comments.length ? (
            <p className="text-center text-gray-500 text-sm py-8">هنوز نظری ثبت نشده است.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-xl p-4 bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{comment.authorName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString("fa-IR")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      comment.is_approved
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {comment.is_approved ? "تایید شده" : "در انتظار تایید"}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-3 leading-7 whitespace-pre-wrap">
                  {comment.body}
                </p>

                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="mt-3 mr-4 border-r-2 border-[#253c8a]/30 pr-3">
                    <p className="text-xs font-medium text-[#253c8a]">
                      پاسخ {reply.authorName}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 leading-7">{reply.body}</p>
                  </div>
                ))}

                <div className="flex flex-wrap gap-2 mt-4">
                  {!comment.is_approved && (
                    <button
                      type="button"
                      onClick={() => handleApprove(comment.id)}
                      className="text-xs bg-[#119E30] text-white px-3 py-1.5 rounded-lg"
                    >
                      تایید
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg"
                  >
                    حذف
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    value={replyDrafts[comment.id] || ""}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [comment.id]: e.target.value }))
                    }
                    placeholder="پاسخ مدیر..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#253c8a]"
                  />
                  <button
                    type="button"
                    onClick={() => handleReply(comment.id)}
                    className="text-xs bg-[#253c8a] text-white px-4 py-2 rounded-lg shrink-0"
                  >
                    ارسال پاسخ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleCommentsModal;
