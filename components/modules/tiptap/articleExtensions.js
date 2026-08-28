import { Node, mergeAttributes } from "@tiptap/core";

export const ArticleAudio = Node.create({
  name: "articleAudio",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "audio[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "audio",
      mergeAttributes(HTMLAttributes, {
        controls: true,
        class: "article-audio w-full my-4",
      }),
    ];
  },
});

export const ArticleVideo = Node.create({
  name: "articleVideo",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: true,
        class: "article-video w-full my-4 rounded-xl",
      }),
    ];
  },
});

export const ArticleIframe = Node.create({
  name: "articleIframe",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "article-video-wrapper my-4" },
      [
        "iframe",
        mergeAttributes(HTMLAttributes, {
          class: "article-iframe w-full aspect-video rounded-xl",
          frameborder: "0",
          allowfullscreen: "true",
        }),
      ],
    ];
  },
});
