import sanitizeHtml from "sanitize-html";

const postHtmlOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "s",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "hr",
    "pre",
    "code",
    "a",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt", "width", "height"],
    code: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"] },
  allowProtocolRelative: false,
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, postHtmlOptions);
}
