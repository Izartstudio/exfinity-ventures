import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/blog/article-hero";
import { RelatedStories } from "@/components/blog/related-stories";
import { RichText } from "@/components/blog/rich-text";
import { Footer } from "@/components/layout/footer";
import { articles, getArticleBySlug } from "@/content/articles";
import { siteName, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug.split("/").pop()! }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
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
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const description = article.body.find((block) => block.type === "paragraph")?.children.map((span) => span.text).join(" ") || article.title;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    image: `${siteUrl}${article.image}`,
    datePublished: new Date(article.date).toISOString(),
    mainEntityOfPage: `${siteUrl}${article.slug}`,
    author: { "@type": "Organization", name: siteName, url: siteUrl },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    <main>
      <ArticleHero article={article} />
      <article className="article-body">
        <div className="container">
          <RichText blocks={article.body} />
          {article.externalUrl && <a className="article-read-more" href={article.externalUrl}>Read more <span aria-hidden="true">›</span></a>}
        </div>
      </article>
      <RelatedStories />
    </main>
    <Footer />
  </>;
}
