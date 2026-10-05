"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { newsItems, type NewsCategory, type NewsItem } from "@/content/news";

const filters = ["All", "Social", "News", "Newsletters"] as const;
type Filter = (typeof filters)[number];

export function NewsLedger({ items = newsItems }: { items?: NewsItem[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const filteredItems = useMemo(
    () => activeFilter === "All" ? items : items.filter((item) => item.category === activeFilter as NewsCategory),
    [activeFilter, items],
  );
  const visibleItems = filteredItems.slice(0, visibleCount);

  const chooseFilter = (filter: Filter) => {
    setActiveFilter(filter);
    setVisibleCount(6);
  };

  return (
    <section className="news-ledger" aria-label="News and updates">
      <div className="container">
        <div className="news-filters" role="group" aria-label="Filter news by category">
          {filters.map((filter) => <button type="button" className={activeFilter === filter ? "is-active" : ""} aria-pressed={activeFilter === filter} onClick={() => chooseFilter(filter)} key={filter}>{filter}</button>)}
        </div>

        <div className="news-ledger-grid" aria-live="polite">
          {visibleItems.map((item) => (
            <article className="news-ledger-card" key={item.id}>
              <Link className="news-ledger-image" href={item.slug} aria-label={item.title}>
                <Image src={item.image} alt="" fill sizes="(max-width: 650px) calc(100vw - 2.5rem), (max-width: 900px) 48vw, 31vw" style={{ objectPosition: item.imagePosition ?? "center center" }} />
              </Link>
              <h2><Link href={item.slug}>{item.title}</Link></h2>
              <time dateTime={new Date(item.date).toISOString()}>{item.date}</time>
              <div className="news-ledger-rule" aria-hidden="true"><span /></div>
              <p>{item.category}</p>
            </article>
          ))}
        </div>

        {visibleCount < filteredItems.length && <button className="news-load-more" type="button" onClick={() => setVisibleCount((count) => count + 6)}>View more <span aria-hidden="true">⌄</span></button>}
      </div>
    </section>
  );
}
