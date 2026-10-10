import "server-only";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { articles as archive, type Article } from "@/content/articles";
import { portableToRichText, type PortableBlock } from "./news-content";

type Post = {
  _id: string; _updatedAt?: string; title: string; slug: string;
  category?: Article["category"]; publishedAt: string; image: string;
  body?: PortableBlock[]; sourceUrl?: string; relatedIds?: string[];
};

// Published documents only. A fresh server request sees CMS edits, additions and
// removals without a Vercel rebuild or a webhook/cache invalidation dependency.
export const getNewsArticles = cache(async (): Promise<Article[]> => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return archive;
  const query = `*[_type == "blogPost" && !(_id in path("drafts.**")) && defined(slug.current)] | order(publishedAt desc){
    _id, _updatedAt, title, "slug": slug.current, category, publishedAt,
    "image": heroImage.asset->url, sourceUrl, "relatedIds": relatedStories[]._ref,
    body[]{..., "src": asset->url, "dimensions": asset->metadata.dimensions}
  }`;
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      ...(process.env.SANITY_API_READ_TOKEN ? { headers: { Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}` } } : {}),
    });
    if (!response.ok) throw new Error(`Sanity news query returned ${response.status}`);
    const { result } = await response.json() as { result: Post[] };
    if (!Array.isArray(result)) throw new Error("Invalid news response");
    // Do not merge static content into successful CMS results: unpublished or
    // deleted articles must disappear rather than reappear from the archive.
    return result.filter(p => p.title && p.image && p.publishedAt && Number.isFinite(Date.parse(p.publishedAt))).map(p => ({
      id: p._id, title: p.title, image: p.image,
      slug: `/news/${p.slug.replace(/^\/?news\//, "")}`,
      date: new Date(p.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }),
      category: p.category ?? "", body: portableToRichText(p.body ?? []),
      externalUrl: p.sourceUrl, relatedIds: p.relatedIds, updatedAt: p._updatedAt,
    }));
  } catch (error) {
    unstable_rethrow(error);
    console.error("News CMS unavailable; serving the verified legacy archive.");
    return archive;
  }
});

export async function getArticleBySlug(slug: string) {
  return (await getNewsArticles()).find(article => article.slug === `/news/${slug}`);
}
