"use client";

import React, { useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Loader from "@/components/modules/Loader";
import deleteArticle from "@/funcs/deleteArticle";
import EditArticleModal from "./EditArticleModal";
import ArticleCommentsModal from "./ArticleCommentsModal";
import { siteUrl, uploadUrl } from "@/data/variables";

function ArticleBox({ meta, getArticlesHandler, pendingCommentsCount = 0, ...article }) {
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [isCommentsModalShow, setIsCommentsModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const coverSrc = article.cover_image
    ? `${uploadUrl}/articles/covers/${article.cover_image}`
    : null;

  const viewUrl = `${siteUrl}/articles/${article.slug}`;

  return (
    <div>
      {isLoading && <Loader />}
      {isEditModalShow && (
        <EditArticleModal
          setIsEditArticleModalShow={setIsEditModalShow}
          articleData={article}
          meta={meta}
        />
      )}
      {isCommentsModalShow && (
        <ArticleCommentsModal
          article={article}
          onClose={() => setIsCommentsModalShow(false)}
          onCommentsChange={getArticlesHandler}
        />
      )}
      <div className="admin-card p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          {coverSrc && (
            <img src={coverSrc} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
          )}
          <div>
            <h2 className="font-bold text-sm md:text-base line-clamp-1">{article.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{article.excerpt}</p>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              {article.category?.name && <span>{article.category.name}</span>}
              <span>
                بازدید: {Number(article.view_count || 0).toLocaleString("fa-IR")}
              </span>
              <span
                className={
                  article.is_published
                    ? "text-[#119E30] font-medium"
                    : "text-gray-500 font-medium"
                }
              >
                {article.is_published ? "انتشار" : "پیش‌نویس"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm shrink-0">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#119E30] flex items-center gap-1 hover:underline"
          >
            مشاهده <VisibilityOutlinedIcon fontSize="small" />
          </a>
          <button
            type="button"
            className="text-[#6366f1] flex items-center gap-1"
            onClick={() => setIsCommentsModalShow(true)}
          >
            نظرات
            <ChatBubbleOutlineIcon fontSize="small" />
            {pendingCommentsCount > 0 && (
              <span className="inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {Number(pendingCommentsCount).toLocaleString("fa-IR")}
              </span>
            )}
          </button>
          <button
            type="button"
            className="text-[#004B8F] flex items-center gap-1"
            onClick={() => setIsEditModalShow(true)}
          >
            ویرایش <BorderColorOutlinedIcon fontSize="small" />
          </button>
          <button
            type="button"
            className="text-[#F51313] flex items-center gap-1"
            onClick={() => {
              setIsLoading(true);
              deleteArticle(article.id).then(() => {
                setIsLoading(false);
                getArticlesHandler();
              });
            }}
          >
            حذف <DeleteOutlineIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArticleBox;
