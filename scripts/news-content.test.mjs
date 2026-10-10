import assert from "node:assert/strict";
import { test } from "node:test";
import { portableToRichText } from "../lib/sanity/news-content.ts";

test("CMS text preserves links, emphasis and heading levels", () => {
  const [heading] = portableToRichText([{ _type: "block", style: "h3", children: [{ text: "Original text", marks: ["strong", "em", "reference"] }], markDefs: [{ _key: "reference", _type: "link", href: "https://example.com/report" }] }]);
  assert.equal(heading.type, "heading");
  assert.equal(heading.level, 3);
  assert.deepEqual(heading.children, [{ text: "Original text", marks: ["bold", "italic"], href: "https://example.com/report" }]);
});
test("CMS lists stop at paragraphs and when list style changes", () => {
  const block = (text, listItem) => ({ _type: "block", children: [{ text }], listItem });
  const blocks = portableToRichText([block("A", "bullet"), block("B", "bullet"), block("C", "number"), block("D"), block("E", "bullet")]);
  assert.deepEqual(blocks.map(b => b.type), ["list", "list", "paragraph", "list"]);
  assert.equal(blocks[0].items.length, 2);
  assert.equal(blocks[1].style, "number");
});
test("CMS supports images, linked reports, podcasts and custom rich content", () => {
  const blocks = portableToRichText([
    { _type: "postImage", src: "https://cdn.sanity.io/report.jpg", alt: "Report", linkUrl: "https://docsend.com/view/report", dimensions: { width: 800, height: 1200 } },
    { _type: "mediaEmbed", url: "https://open.spotify.com/embed/episode/test", title: "Episode" },
    { _type: "pullQuote", quote: "A quote", attribution: "Founder" },
    { _type: "contentTable", headers: ["Stage"], rows: [{ cells: ["Seed"] }] },
    { _type: "codeBlock", code: "test()", language: "js" },
    { _type: "callout", text: "Note", tone: "blue" },
    { _type: "divider" },
  ]);
  assert.equal(blocks[0].height, 1200);
  assert.equal(blocks[0].href, "https://docsend.com/view/report");
  assert.deepEqual(blocks.map(b => b.type), ["image", "embed", "quote", "table", "code", "callout", "divider"]);
});
