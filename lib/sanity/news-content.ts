import type { RichTextBlock, RichTextMark, RichTextSpan } from "@/content/articles";

export type PortableBlock = {
  _type: string; _key?: string; style?: string; listItem?: string;
  children?: { text: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  src?: string; alt?: string; caption?: string; linkUrl?: string;
  dimensions?: { width: number; height: number };
  title?: string; text?: string; tone?: "blue" | "neutral";
  quote?: string; attribution?: string; headers?: string[];
  rows?: { cells: string[] }[]; code?: string; language?: string; url?: string;
};

const marks: Record<string, RichTextMark> = { strong: "bold", em: "italic", underline: "underline", strike: "strike", highlight: "highlight", code: "code", sup: "sup", sub: "sub" };
export function portableToRichText(blocks: PortableBlock[]): RichTextBlock[] {
  const output: RichTextBlock[] = [];
  for (const block of blocks) {
    const children: RichTextSpan[] = (block.children ?? []).map(span => ({
      text: span.text,
      marks: (span.marks ?? []).flatMap(mark => marks[mark] ? [marks[mark]] : []),
      href: block.markDefs?.find(def => (span.marks ?? []).includes(def._key) && def._type === "link")?.href,
    }));
    if (block._type === "block") {
      if (block.listItem) {
        const style = block.listItem === "number" ? "number" : "bullet";
        const previous = output[output.length - 1];
        if (previous?.type === "list" && previous.style === style) previous.items.push(children);
        else output.push({ type: "list", style, items: [children] });
      } else if (["h2", "h3", "h4"].includes(block.style ?? "")) {
        output.push({ type: "heading", level: Number(block.style![1]) as 2 | 3 | 4, children });
      } else if (block.style === "blockquote") output.push({ type: "quote", children });
      else output.push({ type: "paragraph", children, lead: block.style === "lead" });
    } else if (["postImage", "image"].includes(block._type) && block.src) {
      output.push({ type: "image", src: block.src, alt: block.alt ?? "", caption: block.caption, href: block.linkUrl, ...block.dimensions });
    } else if (block._type === "callout") output.push({ type: "callout", title: block.title, tone: block.tone, children: [{ text: block.text ?? "" }] });
    else if (block._type === "pullQuote") output.push({ type: "quote", attribution: block.attribution, children: [{ text: block.quote ?? "" }] });
    else if (block._type === "contentTable") output.push({ type: "table", caption: block.caption, headers: block.headers ?? [], rows: (block.rows ?? []).map(row => row.cells) });
    else if (block._type === "codeBlock") output.push({ type: "code", code: block.code ?? "", language: block.language });
    else if (block._type === "divider") output.push({ type: "divider" });
    else if (block._type === "mediaEmbed" && block.url) output.push({ type: "embed", src: block.url, title: block.title ?? "Media player" });
  }
  return output;
}
