"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { CompaniesSection } from "@/content/homepage-sections";

export function CompaniesWeBack({ content }: { content: CompaniesSection }) {
  const { companies } = content;
  const visibleCellCount = Math.min(6, companies.length);
  const [logoIndexes, setLogoIndexes] = useState(() => Array.from({ length: visibleCellCount }, (_, index) => index));
  const lastCellRef = useRef(-1);
  const isLogoHoveredRef = useRef(false);

  useEffect(() => {
    companies.forEach((company) => {
      const image = new window.Image();
      image.src = company.logo;
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || companies.length <= visibleCellCount) return;

    const timer = window.setInterval(() => {
      if (isLogoHoveredRef.current) return;
      let cell = Math.floor(Math.random() * visibleCellCount);
      if (cell === lastCellRef.current) cell = (cell + 1 + Math.floor(Math.random() * (visibleCellCount - 1))) % visibleCellCount;
      lastCellRef.current = cell;
      setLogoIndexes((current) => {
        const next = [...current];
        const hiddenLogos = companies.map((_, index) => index).filter((index) => !current.includes(index));
        next[cell] = hiddenLogos[Math.floor(Math.random() * hiddenLogos.length)];
        return next;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [companies, visibleCellCount]);

  return (
    <section className="companies-we-back" aria-labelledby="companies-title">
      <div className="container">
        <div className="section-kicker" id="companies-title">
          {content.heading}
        </div>

        <div className="portfolio-wall">
          <div className="portfolio-logo-grid" aria-label="Selected portfolio companies">
            {logoIndexes.map((_, cellIndex) => {
              const company = companies[logoIndexes[cellIndex]];

              return (
                <Link className="portfolio-logo-cell" href={company.href} aria-label={`View ${company.name} portfolio page`} key={cellIndex} onMouseEnter={() => { isLogoHoveredRef.current = true; }} onMouseLeave={() => { isLogoHoveredRef.current = false; }} onFocus={() => { isLogoHoveredRef.current = true; }} onBlur={() => { isLogoHoveredRef.current = false; }}>
                  <div className="portfolio-logo-frame">
                    <Image
                      unoptimized
                      className="portfolio-logo-flip"
                      key={`${cellIndex}-${logoIndexes[cellIndex]}`}
                      src={company.logo}
                      alt={company.name}
                      width={company.width}
                      height={company.height}
                      sizes="159px"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <aside className="portfolio-callout">
            <p>
              {content.description}
            </p>
            <Link className="button button-primary" href={content.ctaHref}><span className="button-label">{content.ctaLabel}</span></Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
