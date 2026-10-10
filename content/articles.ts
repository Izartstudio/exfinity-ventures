import type { NewsItem } from "@/content/news";
import archive from "./news-archive.json";

export type RichTextMark = "bold" | "italic" | "underline" | "strike" | "highlight" | "code" | "sup" | "sub";
export type RichTextSpan = { text: string; marks?: RichTextMark[]; href?: string };
export type RichTextBlock =
  | { type: "paragraph"; children: RichTextSpan[]; lead?: boolean; align?: "left" | "center" | "right" }
  | { type: "heading"; level: 2 | 3 | 4; children: RichTextSpan[] }
  | { type: "list"; style: "bullet" | "number"; items: RichTextSpan[][] }
  | { type: "quote"; children: RichTextSpan[]; attribution?: string }
  | { type: "callout"; tone?: "blue" | "neutral"; title?: string; children: RichTextSpan[] }
  | { type: "image"; src: string; alt: string; caption?: string; width?: number; height?: number; href?: string }
  | { type: "embed"; src: string; title: string }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "code"; language?: string; code: string }
  | { type: "divider" };

export type Article = NewsItem & {
  body: RichTextBlock[];
  externalUrl?: string;
  relatedIds?: string[];
  updatedAt?: string;
};

// Verified export of every page in the legacy news archive.
export const articles = archive as Article[];
