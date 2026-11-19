"use client";

import React, { useEffect, useMemo } from "react";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const ALLOWED = { b: "b", strong: "b", i: "i", em: "i", u: "u", s: "s", del: "s", code: "code", blockquote: "blockquote", a: "a", br: "br", "tg-spoiler": "tg-spoiler" };
const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;
const VIDEO_EXT = /\.(mp4|mov|avi|mkv)$/i;

// فقط تگ‌های مجاز هابرا به المان React تبدیل می‌شوند (بدون dangerouslySetInnerHTML)
function toReact(node, key) {
  if (node.nodeType === 3) {
    const parts = node.textContent.split("\n");
    return parts.flatMap((part, index) => (index ? [<br key={`${key}-br-${index}`} />, part] : [part]));
  }
  if (node.nodeType !== 1) return null;
  const tag = ALLOWED[node.tagName.toLowerCase()];
  const children = Array.from(node.childNodes).map((child, index) => toReact(child, `${key}-${index}`));
  if (!tag) return <React.Fragment key={key}>{children}</React.Fragment>;
  if (tag === "br") return <br key={key} />;
  if (tag === "a") {
    const href = node.getAttribute("href") || "";
    return /^https?:\/\//i.test(href) ? (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="text-[#2481cc] hover:underline">
        {children}
      </a>
    ) : (
      <React.Fragment key={key}>{children}</React.Fragment>
    );
  }
  if (tag === "blockquote") {
    return (
      <blockquote key={key} className="my-1 border-r-2 border-[#2481cc] bg-[#2481cc]/5 pr-2">
        {children}
      </blockquote>
    );
  }
  if (tag === "code") return <code key={key} className="rounded bg-gray-100 px-1 font-mono text-[12px]">{children}</code>;
  if (tag === "tg-spoiler") return <span key={key} className="rounded bg-gray-300 text-transparent hover:text-inherit">{children}</span>;
  return React.createElement(tag, { key }, children);
}

function renderMessage(message, format) {
  if (!message) return null;
  if (format !== "html" || typeof window === "undefined") {
    return message.split("\n").flatMap((part, index) => (index ? [<br key={index} />, part] : [part]));
  }
  const doc = new DOMParser().parseFromString(`<div>${message}</div>`, "text/html");
  return Array.from(doc.body.firstChild.childNodes).map((node, index) => toReact(node, `n${index}`));
}

/**
 * پیش‌نمایش پیام شبیه پیام‌رسان: تصویرها بالا، متن زیر آن، بقیه فایل‌ها به‌صورت پیوست
 * images: [{ key, src }] (مثل تصویر محصول)، files: File[] انتخاب‌شده
 */
function MessagePreview({ message, format, files = [], extraImages = [], channelsCount = 0 }) {
  const fileItems = useMemo(
    () =>
      files.map((file, index) => ({
        key: `${file.name}-${index}`,
        name: file.name,
        isImage: IMAGE_EXT.test(file.name),
        isVideo: VIDEO_EXT.test(file.name),
        url: IMAGE_EXT.test(file.name) || VIDEO_EXT.test(file.name) ? URL.createObjectURL(file) : null,
      })),
    [files]
  );

  useEffect(() => () => fileItems.forEach((item) => item.url && URL.revokeObjectURL(item.url)), [fileItems]);

  const images = [...extraImages, ...fileItems.filter((item) => item.isImage).map((item) => ({ key: item.key, src: item.url }))];
  const videos = fileItems.filter((item) => item.isVideo);
  const documents = fileItems.filter((item) => !item.isImage && !item.isVideo);
  const body = useMemo(() => renderMessage(message.trim(), format), [message, format]);
  const isEmpty = !message.trim() && !images.length && !fileItems.length;

  return (
    <div className="admin-card space-y-3 xl:sticky xl:top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-navy">پیش‌نمایش پیام</h3>
        {channelsCount > 0 && <span className="text-[11px] text-gray-400">{channelsCount.toLocaleString("fa-IR")} کانال</span>}
      </div>

      <div className="rounded-2xl bg-[#d9e4ee] p-3">
        {isEmpty ? (
          <p className="py-10 text-center text-xs text-gray-500">متن یا فایل پیام اینجا نمایش داده می‌شود</p>
        ) : (
          <div className="mr-auto max-w-full overflow-hidden rounded-2xl rounded-bl-md bg-white shadow-sm">
            {images.length > 0 && (
              <div className={`grid gap-0.5 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {images.slice(0, 4).map((image, index) => (
                  <div key={image.key} className="relative">
                    <img
                      src={image.src}
                      alt=""
                      className={`w-full bg-gray-100 object-cover ${images.length > 1 ? "aspect-square" : "max-h-72"}`}
                    />
                    {index === 3 && images.length > 4 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
                        +{(images.length - 4).toLocaleString("fa-IR")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {videos.map((video) => (
              <div key={video.key} className="relative bg-black">
                <video src={video.url} className="max-h-60 w-full" muted />
                <PlayCircleOutlineIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90" sx={{ fontSize: 44 }} />
              </div>
            ))}
            {documents.length > 0 && (
              <div className="space-y-1.5 px-3 pt-2.5">
                {documents.map((item) => (
                  <div key={item.key} className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2481cc] text-white">
                      <InsertDriveFileOutlinedIcon sx={{ fontSize: 18 }} />
                    </span>
                    <span className="truncate" dir="ltr">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
            {body && <div className="break-words px-3 py-2.5 text-[13px] leading-6 text-gray-900">{body}</div>}
            <p className="px-3 pb-1.5 text-left text-[10px] text-gray-400">
              {new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}
      </div>
      <p className="text-[11px] leading-5 text-gray-400">نمایش تقریبی است؛ ظاهر نهایی در هر پیام‌رسان کمی فرق دارد.</p>
    </div>
  );
}

export default MessagePreview;
