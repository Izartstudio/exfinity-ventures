"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type RelatedStory = { title: string; image: string; date: string; category: string; href: string };

const defaultStories: RelatedStory[] = [
  { title: "VC Funding Surges in AI SaaS, Driving Innovation and Growth", image: "/news/related/ai-saas.jpg", date: "Jan 21, 2026", category: "News", href: "/news/fund-four" },
  { title: "Maieutic Raises the Bar for AI Chip Design", image: "/news/related/chip-design.jpg", date: "Jan 21, 2026", category: "News", href: "/news/maieutic-funding" },
  { title: "Rethinking the Future of Analog Chip Design", image: "/news/related/analog-chip.jpg", date: "Jan 15, 2026", category: "News", href: "/news/cloudsek-state-fund" },
];

export function RelatedStories({ stories = defaultStories }: { stories?: RelatedStory[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canMoveBack, setCanMoveBack] = useState(false);
  const [canMoveForward, setCanMoveForward] = useState(true);
  const syncControls = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setCanMoveBack(rail.scrollLeft > 2);
    setCanMoveForward(rail.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    syncControls();
    window.addEventListener("resize", syncControls);
    return () => window.removeEventListener("resize", syncControls);
  }, [stories.length, syncControls]);

  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });

  return (
    <section className="related-stories" aria-labelledby="related-title">
      <div className="related-heading container"><span /><h2 id="related-title">Related Stories</h2></div>
      <div className="related-layout container">
        <div className="related-intro">
          <p>Every investment is made with a long-term perspective; these outcomes reflect years of partnership, execution, and global scale</p>
        </div>
        <div className="related-cards-row">
          <div className="related-controls"><button type="button" disabled={!canMoveBack} onClick={() => move(-1)} aria-label="Previous stories">‹</button><button type="button" disabled={!canMoveForward} onClick={() => move(1)} aria-label="Next stories">›</button></div>
          <div className="related-rail" ref={railRef} onScroll={syncControls}>
            {stories.map((story) => <article className="related-card" key={story.title}>
              <h3><Link href={story.href}>{story.title}</Link></h3>
              <Link className="related-card-image" href={story.href} aria-label={story.title}><Image src={story.image} alt="" fill sizes="220px" /></Link>
              <time dateTime={new Date(story.date).toISOString()}>{story.date}</time>
              <div className="related-card-rule"><span /></div>
              <p>{story.category}</p>
            </article>)}
          </div>
        </div>
      </div>
    </section>
  );
}
