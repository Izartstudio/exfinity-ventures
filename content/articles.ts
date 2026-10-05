import { newsItems, type NewsItem } from "@/content/news";

export type RichTextMark = "bold" | "italic" | "underline" | "strike" | "highlight" | "code" | "sup" | "sub";
export type RichTextSpan = { text: string; marks?: RichTextMark[]; href?: string };
export type RichTextBlock =
  | { type: "paragraph"; children: RichTextSpan[]; lead?: boolean; align?: "left" | "center" | "right" }
  | { type: "heading"; level: 2 | 3 | 4; children: RichTextSpan[] }
  | { type: "list"; style: "bullet" | "number"; items: RichTextSpan[][] }
  | { type: "quote"; children: RichTextSpan[]; attribution?: string }
  | { type: "callout"; tone?: "blue" | "neutral"; title?: string; children: RichTextSpan[] }
  | { type: "image"; src: string; alt: string; caption?: string; width?: number; height?: number }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "code"; language?: string; code: string }
  | { type: "divider" };

export type Article = NewsItem & {
  body: RichTextBlock[];
  externalUrl?: string;
};

const featureBody: RichTextBlock[] = [
  { type: "paragraph", lead: true, children: [{ text: "Exfinity Venture Partners has launched a ₹1,100 crore fourth fund, expanding its focus on semiconductors, physical AI, advanced compute, robotics and enterprise AI software." }] },
  { type: "paragraph", children: [{ text: "The filing for Fund IV has been submitted to SEBI and the firm expects to start raising shortly, partners Chinnu Senthilkumar and Jesper Ludolph told ETEntrepreneur. The fund will remain early-stage focused but allocate a larger portion to follow-on rounds, given longer build and commercialisation cycles in deep tech." }] },
  { type: "paragraph", children: [{ text: "Exfinity has invested in 40 startups so far and has completed 17 investments from its third fund. The firm typically aims for 10–20 per cent ownership and expects cheque sizes to rise modestly in the new fund." }] },
  { type: "paragraph", children: [{ text: "Senthilkumar noted that some of the firm's earliest investments are now being validated as global markets shift — including Kinara AI, backed in 2018 and acquired by NXP Semiconductors, and Chara Technologies, invested in more than three years before rare-earth mineral concerns went mainstream. Exfinity also recently achieved full capital return for its 2016-vintage Fund II, supported by cross-border exits including the acquisitions of Kinara, Locus and AI Palette by multinational buyers." }] },
  { type: "paragraph", children: [{ text: "Fund IV will also target emerging categories such as photonics, quantum computing, hydrogen and energy systems, and life sciences, areas Exfinity has not previously invested in meaningfully but sees maturing rapidly." }] },
];

const genericBody: RichTextBlock[] = [
  { type: "paragraph", lead: true, children: [{ text: "Exfinity partners with ambitious founders building enduring technology companies for global markets." }] },
  { type: "heading", level: 2, children: [{ text: "Building from first principles" }] },
  { type: "paragraph", children: [{ text: "Our approach combines technical depth, patient capital and direct operating support. We work alongside teams as their products, markets and organisations take shape." }] },
  { type: "quote", children: [{ text: "The strongest companies are built through sustained conviction, disciplined execution and a clear view of the customer." }], attribution: "Exfinity Venture Partners" },
  { type: "list", style: "bullet", items: [[{ text: "Deep technical differentiation" }], [{ text: "Clear market validation" }], [{ text: "The ambition to compete globally" }]] },
  { type: "callout", tone: "blue", title: "Key perspective", children: [{ text: "India's engineering depth creates an opportunity to build category-defining companies for the world." }] },
  { type: "table", caption: "Investment focus", headers: ["Stage", "Approach", "Market"], rows: [["Seed to Series A", "Lead or co-lead", "Global"], ["Follow-on", "Reserved capital", "Expansion"]] },
];

export const articles: Article[] = newsItems.map((item) => ({
  ...item,
  body: item.id === "fund-four" ? featureBody : genericBody,
}));

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug.split("/").pop() === slug);
}
