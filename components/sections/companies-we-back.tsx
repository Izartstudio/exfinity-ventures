"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const companies = [
  { name: "Kinara AI", logo: "/companies/vector/kinara.svg", href: "/portfolio/kinara", width: 150, height: 50 },
  { name: "Ati Robotics", logo: "/companies/vector/ati.svg", href: "/portfolio/ati", width: 60, height: 35 },
  { name: "CloudSEK", logo: "/companies/vector/cloudsek.svg", href: "/portfolio/cloudsek", width: 135, height: 28 },
  { name: "Credilio", logo: "/companies/vector/credilio.svg", href: "/portfolio/credilio", width: 150, height: 50 },
  { name: "GridRaster", logo: "/companies/vector/gridraster.svg", href: "/portfolio/gridraster", width: 150, height: 50 },
  { name: "Maieutic", logo: "/companies/portfolio-provided/maieutic.svg", href: "/portfolio/maieutic", width: 150, height: 50 },
  { name: "Pixis", logo: "/companies/vector/pixis.svg", href: "/portfolio/pixis", width: 120, height: 60 },
  { name: "MoEngage", logo: "/companies/vector/moengage.svg", href: "/portfolio/moengage", width: 150, height: 50 },
  { name: "Zyla", logo: "/companies/vector/zyla.svg", href: "/portfolio/zyla-health", width: 150, height: 50 },
  { name: "Chara Motors", logo: "/companies/vector/chara.svg", href: "/portfolio/chara", width: 150, height: 40 },
  { name: "Optimized Electrotech", logo: "/companies/vector/optimized-electrotech.svg", href: "/portfolio/optimized-electrotech", width: 150, height: 50 },
  { name: "Str8bat", logo: "/companies/vector/str8bat.svg", href: "/portfolio/str8bat", width: 150, height: 50 },
] as const;

const visibleCellCount = 6;

export function CompaniesWeBack() {
  const [logoIndexes, setLogoIndexes] = useState(() => Array.from({ length: visibleCellCount }, (_, index) => index));
  const lastCellRef = useRef(-1);
  const isLogoHoveredRef = useRef(false);

  useEffect(() => {
    companies.forEach((company) => {
      const image = new window.Image();
      image.src = company.logo;
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

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
  }, []);

  return (
    <section className="companies-we-back" aria-labelledby="companies-title">
      <div className="container">
        <div className="section-kicker" id="companies-title">
          Companies We Back
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
              From DeepTech to AI Native Softwares, these are companies we believed
              in at the earliest stage; now building for global markets
            </p>
            <Link className="button button-primary" href="/portfolio">
              View Portfolio <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
