"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import ArticleEditor from "@/components/modules/ArticleEditor";
import createArticle from "@/funcs/createArticle";
import ArticleCoverField from "./ArticleCoverField";
import PersianDateField from "./PersianDateField";

function formatPublishedDate(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function AddArticleModal({ setIsAddArticleModalShow, meta }) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [publishStatus, setPublishStatus] = useState("published");
  const [publishedAt, setPublishedAt] = useState(new Date());

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    setIsLoading(true);
    createArticle({
      title: form.title.value,
      slug: form.slug.value,
      excerpt: form.excerpt.value,
      content,
      category_id: form.category_id.value || "",
      tag_ids: JSON.stringify(selectedTags),
      author: form.author.value,
      read_time: form.read_time.value,
      published_at: formatPublishedDate(publishedAt),
      featured: false,
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
            onClick={() => setIsAddArticleModalShow(false)}
          >
            <CloseIcon />
          </button>

          <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-6">
            افزودن مقاله
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <ArticleCoverField cover={cover} onCoverChange={setCover} />

            <section className="admin-section space-y-4">
              <h3 className="admin-section-title">اطلاعات اصلی</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">عنوان</label>
                  <input name="title" required className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    اسلاگ (اختیاری)
                  </label>
                  <input name="slug" className="admin-input" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">خلاصه</label>
                <textarea name="excerpt" required rows={3} className="admin-input min-h-[88px]" />
              </div>
            </section>

            <section className="admin-section space-y-4">
              <h3 className="admin-section-title">تنظیمات انتشار</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">نویسنده</label>
                  <input
                    name="author"
                    defaultValue="تیم احسانی مارکت"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    زمان مطالعه (دقیقه)
                  </label>
                  <input
                    name="read_time"
                    type="number"
                    min="1"
                    defaultValue={5}
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
                <select name="category_id" className="admin-input">
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
              ثبت مقاله
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddArticleModal;
