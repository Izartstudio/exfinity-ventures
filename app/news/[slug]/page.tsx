import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/blog/article-hero";
import { RelatedStories } from "@/components/blog/related-stories";
import { RichText } from "@/components/blog/rich-text";
import { Footer } from "@/components/layout/footer";
import { getNewsArticles, getArticleBySlug } from "@/lib/sanity/news";
import { siteName, siteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const description = article.body.find((block) => block.type === "paragraph")?.children.map((span) => span.text).join(" ")
    || `Read ${article.title} from ${siteName}.`;

  return {
    title: article.title,
    description,
    alternates: { canonical: article.slug },
    openGraph: {
      title: article.title,
      description,
      url: article.slug,
      siteName,
      type: "article",
      locale: "en_IN",
      publishedTime: new Date(article.date).toISOString(),
      images: [{ url: article.image, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const allArticles = await getNewsArticles();
  const candidates = allArticles.filter(item => item.id !== article.id);
  const selected = article.relatedIds?.length ? candidates.filter(item => article.relatedIds!.includes(item.id)) : candidates.slice(0, 6);
  const stories = selected.map(item => ({ title: item.title, image: item.image, date: item.date, category: item.category, href: item.slug }));

  const description = article.body.find((block) => block.type === "paragraph")?.children.map((span) => span.text).join(" ") || article.title;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    image: new URL(article.image, siteUrl).href,
    datePublished: new Date(article.date).toISOString(),
    mainEntityOfPage: `${siteUrl}${article.slug}`,
    author: { "@type": "Organization", name: siteName, url: siteUrl },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
    <main>
      <ArticleHero article={article} />
      <article className="article-body">
        <div className="container">
          <RichText blocks={article.body} />
          {article.externalUrl && <a className="article-read-more" href={article.externalUrl}><span className="article-read-more-label">Read more</span></a>}
        </div>
      </article>
      {stories.length > 0 && <RelatedStories stories={stories} />}
    </main>
    <Footer />
  </>;
}
