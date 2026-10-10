import Image from "next/image";
import type { Article } from "@/content/articles";
import { ArticleShare } from "./article-share";
import { siteUrl } from "@/lib/seo";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <header className="article-hero">
      <Image className="article-hero-mark" src="/blog/vectorbg.svg" alt="" fill priority sizes="100vw" aria-hidden="true" />
      <div className="article-hero-content container">
        <div className="article-hero-copy">
          <div className="article-meta"><time dateTime={new Date(article.date).toISOString()}>{article.date}</time><i aria-hidden="true" /><span>{article.category}</span></div>
          <h1>{article.title}</h1>
        </div>
        <div className="article-hero-media">
          <ArticleShare title={article.title} url={`${siteUrl}${article.slug}`} />
          <div className="article-lead-image"><Image quality={100} src={article.image} alt="" fill priority sizes="(max-width: 900px) 200vw, 100vw" /></div>
        </div>
      </div>
    </header>
  );
}
