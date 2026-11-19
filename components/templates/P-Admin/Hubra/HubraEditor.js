"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import FormatClearIcon from "@mui/icons-material/FormatClear";

// ویرایشگر پیام هابرا: فقط قالب‌هایی که هابرا پشتیبانی می‌کند
// (<b> <i> <u> <s> <code> <blockquote> <a href> و خط جدید)

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (text) => escapeHtml(text).replace(/"/g, "&quot;");

// HTML ویرایشگر => HTML هابرا (پاراگراف‌ها با خط جدید جدا می‌شوند)
function serializeInline(node) {
  if (node.nodeType === 3) return escapeHtml(node.textContent);
  if (node.nodeType !== 1) return "";
  const tag = node.tagName.toLowerCase();
  const inner = Array.from(node.childNodes).map(serializeInline).join("");
  if (tag === "br") return "\n";
  if (tag === "strong" || tag === "b") return inner ? `<b>${inner}</b>` : "";
  if (tag === "em" || tag === "i") return inner ? `<i>${inner}</i>` : "";
  if (tag === "u") return inner ? `<u>${inner}</u>` : "";
  if (tag === "s" || tag === "del" || tag === "strike") return inner ? `<s>${inner}</s>` : "";
  if (tag === "code") return inner ? `<code>${inner}</code>` : "";
  if (tag === "a") {
    const href = node.getAttribute("href") || "";
    return /^https?:\/\//i.test(href) ? `<a href="${escapeAttr(href)}">${inner}</a>` : inner;
  }
  return inner;
}

function serializeBlocks(container) {
  const lines = [];
  for (const node of Array.from(container.childNodes)) {
    if (node.nodeType === 1 && node.tagName.toLowerCase() === "blockquote") {
      lines.push(`<blockquote>${serializeBlocks(node)}</blockquote>`);
    } else if (node.nodeType === 1 && node.tagName.toLowerCase() === "p") {
      lines.push(Array.from(node.childNodes).map(serializeInline).join(""));
    } else {
      lines.push(serializeInline(node));
    }
  }
  return lines.join("\n");
}

export function editorHtmlToHubra(html) {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  return serializeBlocks(doc.body.firstChild).replace(/\n+$/, "");
}

// HTML هابرا => HTML ویرایشگر (هر خط یک پاراگراف)
const linesToParagraphs = (text) =>
  text
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

export function hubraToEditorHtml(message) {
  const text = String(message || "");
  const parts = text.split(/(<blockquote>[\s\S]*?<\/blockquote>)/i);
  return parts
    .map((part) => {
      const quote = part.match(/^<blockquote>([\s\S]*?)<\/blockquote>$/i);
      if (quote) return `<blockquote>${linesToParagraphs(quote[1])}</blockquote>`;
      const trimmed = part.replace(/^\n/, "").replace(/\n$/, "");
      return trimmed ? linesToParagraphs(trimmed) : "";
    })
    .join("");
}

export function hubraToPlain(message) {
  if (typeof window === "undefined") return message;
  const doc = new DOMParser().parseFromString(`<div>${String(message || "").replace(/\n/g, "<br>")}</div>`, "text/html");
  doc.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  return doc.body.textContent;
}

function ToolButton({ active, onClick, title, children, disabled }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
        active ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function HubraEditor({ value, onChange, maxLength = 4000 }) {
  const lastEmitted = useRef(value);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [, forceRender] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
        codeBlock: false,
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https"], defaultProtocol: "https" }),
    ],
    content: hubraToEditorHtml(value),
    editorProps: {
      attributes: {
        dir: "rtl",
        class:
          "hubra-editor min-h-[220px] max-h-[420px] overflow-y-auto px-4 py-3 text-sm leading-7 text-gray-800 focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const next = editorHtmlToHubra(instance.getHTML());
      lastEmitted.current = next;
      onChange(next);
    },
    onSelectionUpdate: () => forceRender((n) => n + 1),
  });

  // اگر متن از بیرون عوض شد (مثلاً انتخاب محصول یا پاک شدن بعد از ارسال)
  useEffect(() => {
    if (!editor || value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(hubraToEditorHtml(value), false);
  }, [editor, value]);

  const applyLink = () => {
    const raw = linkUrl.trim();
    if (!raw) return;
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const { empty } = editor.state.selection;
    if (empty) {
      editor.chain().focus().insertContent(`<a href="${escapeAttr(url)}">${escapeHtml(raw)}</a>`).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkUrl("");
    setLinkOpen(false);
  };

  const is = (name) => Boolean(editor?.isActive(name));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#CA8549] focus-within:ring-2 focus-within:ring-[#CA8549]/15">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50/80 px-2 py-1.5">
        <ToolButton title="پررنگ" active={is("bold")} disabled={!editor} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBoldIcon fontSize="small" />
        </ToolButton>
        <ToolButton title="کج" active={is("italic")} disabled={!editor} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalicIcon fontSize="small" />
        </ToolButton>
        <ToolButton title="زیرخط" active={is("underline")} disabled={!editor} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FormatUnderlinedIcon fontSize="small" />
        </ToolButton>
        <ToolButton title="خط‌خورده" active={is("strike")} disabled={!editor} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <StrikethroughSIcon fontSize="small" />
        </ToolButton>
        <ToolButton title="کد" active={is("code")} disabled={!editor} onClick={() => editor.chain().focus().toggleCode().run()}>
          <CodeIcon fontSize="small" />
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <ToolButton title="نقل‌قول" active={is("blockquote")} disabled={!editor} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <FormatQuoteIcon fontSize="small" />
        </ToolButton>
        <ToolButton
          title="لینک"
          active={is("link") || linkOpen}
          disabled={!editor}
          onClick={() => {
            setLinkUrl(editor.getAttributes("link").href || "");
            setLinkOpen((open) => !open);
          }}
        >
          <InsertLinkIcon fontSize="small" />
        </ToolButton>
        {is("link") && (
          <ToolButton title="حذف لینک" disabled={!editor} onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}>
            <LinkOffIcon fontSize="small" />
          </ToolButton>
        )}
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <ToolButton title="پاک کردن قالب‌بندی" disabled={!editor} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <FormatClearIcon fontSize="small" />
        </ToolButton>
        <span className="mr-auto text-[11px] text-gray-400">
          {String(value || "").length.toLocaleString("fa-IR")} / {maxLength.toLocaleString("fa-IR")}
        </span>
      </div>

      {linkOpen && (
        <div className="flex gap-2 border-b border-gray-100 bg-white px-3 py-2">
          <input
            dir="ltr"
            autoFocus
            className="admin-input !py-1.5 text-sm"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
            }}
            placeholder="https://ehsanimarket.ir/..."
          />
          <button type="button" className="admin-btn-accent !py-1.5 shrink-0" onClick={applyLink}>
            ثبت لینک
          </button>
        </div>
      )}

      <EditorContent editor={editor} />

      <style jsx global>{`
        .hubra-editor p { margin: 0; min-height: 1.75rem; }
        .hubra-editor blockquote { border-right: 3px solid #2481cc; background: rgba(36, 129, 204, 0.06); padding: 2px 10px; margin: 4px 0; }
        .hubra-editor a { color: #2481cc; text-decoration: underline; }
        .hubra-editor code { background: #f1f5f9; border-radius: 4px; padding: 0 4px; font-family: monospace; font-size: 12px; }
      `}</style>
    </div>
  );
}

export default HubraEditor;
