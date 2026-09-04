"use client";

import Loader from "@/components/modules/Loader";
import updateSiteSettings from "@/funcs/updateSiteSettings";
import { uploadUrl, siteUrl } from "@/data/variables";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import { useMemo, useState } from "react";

const basicSections = [
  {
    title: "اطلاعات تماس",
    fields: [
      { key: "phone_landline", label: "تلفن ثابت", type: "text" },
      { key: "phone_mobile", label: "موبایل", type: "text" },
      { key: "email", label: "ایمیل", type: "email" },
      { key: "address", label: "آدرس", type: "textarea", rows: 2 },
    ],
  },
  {
    title: "شبکه‌های اجتماعی",
    fields: [
      { key: "instagram_url", label: "لینک اینستاگرام", type: "url" },
      { key: "telegram_url", label: "لینک تلگرام", type: "url" },
      { key: "whatsapp_url", label: "لینک واتساپ", type: "url" },
      { key: "bale_url", label: "لینک بله", type: "url" },
    ],
  },
  {
    title: "سایر",
    fields: [
      { key: "footer_description", label: "متن فوتر", type: "textarea", rows: 4 },
      { key: "map_embed_url", label: "لینک embed نقشه", type: "textarea", rows: 3 },
    ],
  },
];

const aboutItems = [
  { type: "field", key: "about_title", label: "عنوان اصلی", inputType: "text" },
  {
    type: "image",
    key: "about_image_hero",
    label: "تصویر پس‌زمینه هیرو",
    fallback: "/images/about-us-1.jpg",
  },
  {
    type: "field",
    key: "about_hero_text",
    label: "متن معرفی (هیرو)",
    inputType: "textarea",
    rows: 3,
  },
  { type: "divider", label: "بخش اول — داستان ما" },
  { type: "field", key: "about_section_1_title", label: "عنوان بخش اول", inputType: "text" },
  {
    type: "image",
    key: "about_image_section_1",
    label: "تصویر بخش اول",
    fallback: "/images/about-us-2.jpg",
  },
  {
    type: "field",
    key: "about_section_1_text",
    label: "متن بخش اول",
    inputType: "textarea",
    rows: 5,
  },
  { type: "divider", label: "بخش دوم — فروش آنلاین" },
  { type: "field", key: "about_section_2_title", label: "عنوان بخش دوم", inputType: "text" },
  {
    type: "image",
    key: "about_image_section_2",
    label: "تصویر بخش دوم",
    fallback: "/images/about-us-3.jpg",
  },
  {
    type: "field",
    key: "about_section_2_text",
    label: "متن بخش دوم",
    inputType: "textarea",
    rows: 5,
  },
  { type: "divider", label: "بنر و تماس" },
  {
    type: "image",
    key: "about_image_banner",
    label: "بنر تمام‌عرض",
    fallback: "/images/about-us-4.jpg",
  },
  {
    type: "image",
    key: "about_image_cta",
    label: "تصویر بخش تماس (CTA)",
    fallback: "/images/contact-us.jpg",
  },
];

function getPreviewSrc(key, filename, fallback, previewFiles) {
  if (previewFiles[key]) {
    return previewFiles[key];
  }
  if (filename) {
    return `${uploadUrl}/site_settings/${filename}`;
  }
  return `${siteUrl}${fallback}`;
}

function SaveButton({ isLoading, compact = false, className = "" }) {
  const label = isLoading ? "در حال ذخیره…" : compact ? "ذخیره" : "ذخیره تغییرات";

  return (
    <button
      type="submit"
      form="site-settings-form"
      disabled={isLoading}
      className={`${compact ? "admin-section-save" : "admin-btn-accent"} ${className}`.trim()}
    >
      {label}
    </button>
  );
}

function SectionHeader({ title, showSave, isLoading }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
      <h2 className="text-base font-bold text-brand-navy">{title}</h2>
      {showSave && <SaveButton isLoading={isLoading} compact />}
    </div>
  );
}

function TextField({ field, form, onChange }) {
  return (
    <div>
      <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1.5">
        {field.label}
      </label>
      {field.inputType === "textarea" ? (
        <textarea
          id={field.key}
          rows={field.rows || 3}
          value={form[field.key] || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="admin-input"
        />
      ) : (
        <input
          id={field.key}
          type={field.inputType}
          value={form[field.key] || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="admin-input"
        />
      )}
    </div>
  );
}

function ImageField({ item, form, previewMap, onImageChange }) {
  return (
    <div className="space-y-3 rounded-xl border border-dashed border-[#CA8549]/25 bg-[#CA8549]/5 p-4">
      <label htmlFor={item.key} className="block text-sm font-medium text-gray-700">
        {item.label}
      </label>
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <img
          src={getPreviewSrc(item.key, form[item.key], item.fallback, previewMap)}
          alt={item.label}
          className="w-full h-40 object-cover"
        />
      </div>
      <input
        id={item.key}
        type="file"
        accept="image/*"
        onChange={(e) => onImageChange(item.key, e.target.files?.[0])}
        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#CA8549] hover:file:bg-[#CA8549]/10"
      />
    </div>
  );
}

function SiteSettingsMain({ initialSettings }) {
  const [form, setForm] = useState(initialSettings || {});
  const [imageFiles, setImageFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const previewMap = useMemo(() => imagePreviews, [imagePreviews]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (key, file) => {
    if (!file) return;

    setImageFiles((prev) => ({ ...prev, [key]: file }));
    setImagePreviews((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateSiteSettings(form, imageFiles);

    if (result?.status && result.body) {
      setForm(result.body);
      setImageFiles({});
      setImagePreviews({});
    }

    setIsLoading(false);
  };

  return (
    <AdminPageShell
      narrow
      stickyHeader
      title="اطلاعات کلی سایت"
      description="شماره تماس، شبکه‌های اجتماعی و محتوای صفحه درباره ما را از اینجا مدیریت کنید."
      actions={<SaveButton isLoading={isLoading} />}
    >
      {isLoading && <Loader />}
      <form id="site-settings-form" onSubmit={handleSubmit} className="space-y-6">
        {basicSections.slice(0, 2).map((section) => (
          <section
            key={section.title}
            className="admin-section"
          >
            <SectionHeader
              title={section.title}
              showSave
              isLoading={isLoading}
            />
            {section.fields.map((field) => (
              <TextField
                key={field.key}
                field={{ ...field, inputType: field.type }}
                form={form}
                onChange={handleChange}
              />
            ))}
          </section>
        ))}

        <section className="admin-section">
          <h2 className="text-base font-bold text-[#253c8a] border-b border-gray-100 pb-3">
            درباره ما
          </h2>

          {aboutItems.map((item) => {
            if (item.type === "divider") {
              return (
                <p
                  key={item.label}
                  className="text-xs font-bold text-[#CA8549] pt-2 border-t border-gray-100"
                >
                  {item.label}
                </p>
              );
            }

            if (item.type === "image") {
              return (
                <ImageField
                  key={item.key}
                  item={item}
                  form={form}
                  previewMap={previewMap}
                  onImageChange={handleImageChange}
                />
              );
            }

            return (
              <TextField
                key={item.key}
                field={item}
                form={form}
                onChange={handleChange}
              />
            );
          })}
        </section>

        {basicSections.slice(2).map((section) => (
          <section
            key={section.title}
            className="admin-section"
          >
            <h2 className="admin-section-title">
              {section.title}
            </h2>
            {section.fields.map((field) => (
              <TextField
                key={field.key}
                field={{ ...field, inputType: field.type }}
                form={form}
                onChange={handleChange}
              />
            ))}
          </section>
        ))}

      </form>
    </AdminPageShell>
  );
}

export default SiteSettingsMain;
