"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const companies = [
  { name: "Ati Robotics", logo: "/companies/vector/ati.svg", width: 60, height: 35 },
  { name: "Chara", logo: "/companies/vector/chara.svg", width: 150, height: 40 },
  { name: "Pixis", logo: "/companies/vector/pixis.svg", width: 120, height: 60 },
  { name: "Edge", logo: "/companies/vector/edge-networks.svg", width: 125, height: 43 },
  { name: "CloudSEK", logo: "/companies/vector/cloudsek.svg", width: 135, height: 28 },
  { name: "Cult.fit", logo: "/companies/vector/curefit.svg", width: 83, height: 70 },
  { name: "AI Palette", logo: "/companies/vector/ai-palette.svg", width: 200, height: 43 },
  { name: "RagaAI", logo: "/companies/vector/raga-ai.svg", width: 137, height: 32 },
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
                <div className="portfolio-logo-cell" key={cellIndex} onMouseEnter={() => { isLogoHoveredRef.current = true; }} onMouseLeave={() => { isLogoHoveredRef.current = false; }}>
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
                </div>
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
