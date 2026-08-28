"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useCallback, useRef, useState } from "react";
import { apiBaseUrl } from "@/data/variables";
import uploadArticleMedia from "@/funcs/uploadArticleMedia";
import {
  ArticleAudio,
  ArticleVideo,
  ArticleIframe,
} from "@/components/modules/tiptap/articleExtensions";

function normalizeEmbedUrl(url = "") {
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed.match(/^https?:\/\//) ? trimmed : `https://${trimmed}`;
}

function ArticleEditor({ content = "", onChange }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TextStyle,
      Color,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      ArticleAudio,
      ArticleVideo,
      ArticleIframe,
    ],
    content,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg focus:outline-none min-h-[320px] max-h-[520px] overflow-y-auto p-4 border rounded-lg tiptap-content",
        dir: "rtl",
      },
    },
  });

  const insertUploadedMedia = useCallback(
    async (file, type) => {
      if (!editor || !file) return;
      const result = await uploadArticleMedia(file);
      if (!result?.url) return;

      const fullUrl = `${apiBaseUrl}${result.url}`;

      if (type === "image") {
        editor.chain().focus().setImage({ src: fullUrl }).run();
      } else if (type === "video") {
        editor
          .chain()
          .focus()
          .insertContent(
            `<video src="${fullUrl}" controls class="article-video w-full my-4 rounded-xl"></video>`
          )
          .run();
      } else if (type === "audio") {
        editor
          .chain()
          .focus()
          .insertContent(
            `<audio src="${fullUrl}" controls class="article-audio w-full my-4"></audio>`
          )
          .run();
      }
    },
    [editor]
  );

  const insertIframe = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("آدرس embed iframe را وارد کنید");
    const embedUrl = normalizeEmbedUrl(url || "");
    if (!embedUrl) return;

    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="article-video-wrapper"><iframe src="${embedUrl}" class="article-iframe w-full aspect-video rounded-xl" frameborder="0" allowfullscreen></iframe></div>`
      )
      .run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!linkUrl || !editor) return;
    const url = linkUrl.match(/^https?:\/\//) ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setLinkUrl("");
    setShowLinkMenu(false);
  }, [editor, linkUrl]);

  if (!editor) return null;

  const btnClass = (active) =>
    `p-2 rounded hover:bg-gray-100 ${active ? "bg-gray-200" : ""}`;

  return (
    <div className="tiptap-editor" dir="rtl">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          insertUploadedMedia(e.target.files?.[0], "image");
          e.target.value = "";
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          insertUploadedMedia(e.target.files?.[0], "video");
          e.target.value = "";
        }}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          insertUploadedMedia(e.target.files?.[0], "audio");
          e.target.value = "";
        }}
      />

      <div className="toolbar bg-white border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="پررنگ">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="مورب">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))} title="زیرخط">U</button>
        <div className="border-r border-gray-300 mx-1 h-6" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))}>H3</button>
        <div className="border-r border-gray-300 mx-1 h-6" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="لیست">•</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="لیست شماره‌ای">1.</button>
        <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btnClass(false)} title="جدول">جدول</button>
        <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className={btnClass(false)} title="ستون">+ستون</button>
        <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className={btnClass(false)} title="سطر">+سطر</button>
        <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className={btnClass(false)} title="حذف جدول">×جدول</button>
        <div className="border-r border-gray-300 mx-1 h-6" />
        <button type="button" onClick={() => imageInputRef.current?.click()} className={btnClass(false)} title="عکس">عکس</button>
        <button type="button" onClick={() => videoInputRef.current?.click()} className={btnClass(false)} title="ویدیو">ویدیو</button>
        <button type="button" onClick={() => audioInputRef.current?.click()} className={btnClass(false)} title="صوت">صوت</button>
        <button type="button" onClick={insertIframe} className={btnClass(false)} title="iframe">iframe</button>
        <div className="border-r border-gray-300 mx-1 h-6" />
        <div className="relative">
          <button type="button" onClick={() => setShowLinkMenu(!showLinkMenu)} className={btnClass(editor.isActive("link"))} title="لینک">🔗</button>
          {showLinkMenu && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-lg shadow-lg z-10 flex">
              <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="آدرس لینک" className="border rounded px-2 py-1 text-sm w-56" />
              <button type="button" onClick={setLink} className="bg-blue-600 text-white px-2 py-1 rounded text-sm mr-2">تایید</button>
            </div>
          )}
        </div>
      </div>
      <EditorContent editor={editor} className="border border-t-0 rounded-b-lg" />
    </div>
  );
}

export default ArticleEditor;
