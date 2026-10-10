import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { RichTextBlock, RichTextSpan } from "@/content/articles";

function renderSpan(span: RichTextSpan, key: number) {
  let content: ReactNode = span.text;
  span.marks?.forEach((mark) => {
    if (mark === "bold") content = <strong>{content}</strong>;
    if (mark === "italic") content = <em>{content}</em>;
    if (mark === "underline") content = <u>{content}</u>;
    if (mark === "strike") content = <s>{content}</s>;
    if (mark === "highlight") content = <mark>{content}</mark>;
    if (mark === "code") content = <code>{content}</code>;
    if (mark === "sup") content = <sup>{content}</sup>;
    if (mark === "sub") content = <sub>{content}</sub>;
  });
  if (span.href) content = <Link href={span.href}>{content}</Link>;
  return <span key={key}>{content}</span>;
}

const spans = (children: RichTextSpan[]) => children.map(renderSpan);

export function RichText({ blocks }: { blocks: RichTextBlock[] }) {
  return <div className="rich-text">
    {blocks.map((block, index) => {
      if (block.type === "paragraph") return <p className={block.lead ? "rich-text-lead" : undefined} style={{ textAlign: block.align }} key={index}>{spans(block.children)}</p>;
      if (block.type === "heading") {
        if (block.level === 2) return <h2 key={index}>{spans(block.children)}</h2>;
        if (block.level === 3) return <h3 key={index}>{spans(block.children)}</h3>;
        return <h4 key={index}>{spans(block.children)}</h4>;
      }
      if (block.type === "list") {
        const List = block.style === "number" ? "ol" : "ul";
        return <List key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{spans(item)}</li>)}</List>;
      }
      if (block.type === "quote") return <blockquote key={index}><p>{spans(block.children)}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>;
      if (block.type === "callout") return <aside className={`rich-text-callout is-${block.tone ?? "neutral"}`} key={index}>{block.title && <h3>{block.title}</h3>}<p>{spans(block.children)}</p></aside>;
      if (block.type === "image") {
        const image = <Image quality={100} src={block.src} alt={block.alt} width={block.width ?? 1200} height={block.height ?? 750} sizes="(max-width: 800px) calc(100vw - 2.5rem), 760px" style={{ height: "auto" }} />;
        return <figure key={index}>{block.href ? <a href={block.href}>{image}</a> : image}{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
      }
      if (block.type === "embed") {
        let allowed = false;
        try { const url = new URL(block.src); allowed = url.protocol === "https:" && ["open.spotify.com", "w.soundcloud.com"].includes(url.hostname); } catch { /* Invalid CMS URL */ }
        return allowed ? <iframe key={index} src={block.src} title={block.title} loading="lazy" allow="encrypted-media; fullscreen; picture-in-picture" style={{ width: "100%", height: 352, border: 0 }} /> : null;
      }
      if (block.type === "table") return <div className="rich-text-table-wrap" key={index}><table>{block.caption && <caption>{block.caption}</caption>}<thead><tr>{block.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
      if (block.type === "code") return <pre key={index}><code data-language={block.language}>{block.code}</code></pre>;
      return <hr key={index} />;
    })}
  </div>;
}
