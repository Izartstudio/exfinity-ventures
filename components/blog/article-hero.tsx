import Image from "next/image";
import type { Article } from "@/content/articles";

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
          <div className="article-share"><span>Share via</span><div><a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`https://www.exfinityventures.com${article.slug}`)}`} aria-label="Share by email">↗</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.exfinityventures.com${article.slug}`)}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">in</a><a href={`https://x.com/intent/post?url=${encodeURIComponent(`https://www.exfinityventures.com${article.slug}`)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noreferrer" aria-label="Share on X">𝕏</a></div></div>
          <div className="article-lead-image"><Image src={article.image} alt="" fill priority sizes="(max-width: 900px) calc(100vw - 2.5rem), 48vw" /></div>
        </div>
      </div>
    </header>
  );
}
