"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import ArticleEditor from "@/components/modules/ArticleEditor";
import editArticle from "@/funcs/editArticle";
import { uploadUrl } from "@/data/variables";
import ArticleCoverField from "./ArticleCoverField";
import PersianDateField from "./PersianDateField";

function formatPublishedDate(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function EditArticleModal({ setIsEditArticleModalShow, articleData, meta }) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(articleData.content || "");
  const [cover, setCover] = useState(null);
  const [selectedTags, setSelectedTags] = useState(articleData.tag_ids || []);
  const [publishStatus, setPublishStatus] = useState(
    articleData.is_published ? "published" : "draft"
  );
  const [publishedAt, setPublishedAt] = useState(() => {
    if (!articleData.published_at) return new Date();
    return new Date(articleData.published_at);
  });

  const currentCoverUrl = articleData.cover_image
    ? `${uploadUrl}/articles/covers/${articleData.cover_image}`
    : "";

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    setIsLoading(true);
    editArticle(articleData.id, {
      title: form.title.value,
      slug: form.slug.value,
      excerpt: form.excerpt.value,
      content,
      category_id: form.category_id.value || "",
      tag_ids: JSON.stringify(selectedTags),
      author: form.author.value,
      read_time: form.read_time.value,
      published_at: formatPublishedDate(publishedAt),
      featured: articleData.featured || false,
      is_published: publishStatus === "published",
      cover,
    }).then(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div className="admin-modal-panel max-w-[980px] !px-5 sm:!px-8">
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setIsEditArticleModalShow(false)}
          >
            <CloseIcon />
          </button>

          <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-6">
            ویرایش مقاله
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <ArticleCoverField
              cover={cover}
              onCoverChange={setCover}
              currentCoverUrl={currentCoverUrl}
              currentCoverName={articleData.cover_image || ""}
            />

            <section className="admin-section space-y-4">
              <h3 className="admin-section-title">اطلاعات اصلی</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">عنوان</label>
                  <input
                    name="title"
                    required
                    defaultValue={articleData.title}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">اسلاگ</label>
                  <input
                    name="slug"
                    defaultValue={articleData.slug}
                    className="admin-input"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">خلاصه</label>
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  defaultValue={articleData.excerpt}
                  className="admin-input min-h-[88px]"
                />
              </div>
            </section>

            <section className="admin-section space-y-4">
              <h3 className="admin-section-title">تنظیمات انتشار</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">نویسنده</label>
                  <input
                    name="author"
                    defaultValue={articleData.author}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">زمان مطالعه</label>
                  <input
                    name="read_time"
                    type="number"
                    min="1"
                    defaultValue={articleData.read_time}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">تاریخ انتشار</label>
                  <PersianDateField value={publishedAt} onChange={setPublishedAt} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">وضعیت</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPublishStatus("draft")}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        publishStatus === "draft"
                          ? "bg-gray-700 text-white border-gray-700"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      پیش‌نویس
                    </button>
                    <button
                      type="button"
                      onClick={() => setPublishStatus("published")}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        publishStatus === "published"
                          ? "bg-[#119E30] text-white border-[#119E30]"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      انتشار
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-section space-y-4">
              <h3 className="admin-section-title">دسته‌بندی و برچسب</h3>
              <div>
                <label className="block text-sm font-bold mb-1.5">دسته</label>
                <select
                  name="category_id"
                  defaultValue={articleData.category_id || ""}
                  className="admin-input"
                >
                  <option value="">بدون دسته</option>
                  {meta.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">برچسب‌ها</label>
                <div className="flex flex-wrap gap-2">
                  {meta.tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                        selectedTags.includes(tag.id)
                          ? "bg-brand-gold text-white border-brand-gold"
                          : "bg-white text-gray-600 border-gray-200 hover:border-brand-gold/40"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="admin-section">
              <h3 className="admin-section-title mb-4">محتوای مقاله</h3>
              <ArticleEditor content={content} onChange={setContent} />
            </section>

            <button type="submit" className="admin-btn-accent w-full md:w-auto md:min-w-[220px] mx-auto block">
              ذخیره تغییرات
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditArticleModal;
