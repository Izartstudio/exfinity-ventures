"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const companies = [
  { name: "Ati Robotics", logo: "/companies/ati.png", width: 584, height: 584 },
  { name: "Chara", logo: "/companies/chara.png", width: 500, height: 500 },
  { name: "Pixis", logo: "/companies/pixis.png", width: 500, height: 251 },
  { name: "Edge", logo: "/companies/edge.png", width: 280, height: 280 },
  { name: "CloudSEK", logo: "/companies/cloudsek.png", width: 280, height: 280 },
  { name: "Cult.fit", logo: "/companies/cult-fit.png", width: 280, height: 280 },
  { name: "AI Palette", logo: "/companies/ai-palette.png", width: 280, height: 280 },
  { name: "RagaAI", logo: "/companies/raga-ai.webp", width: 500, height: 176 },
] as const;

const visibleCellCount = 6;

export function CompaniesWeBack() {
  const [logoIndexes, setLogoIndexes] = useState(() => Array.from({ length: visibleCellCount }, (_, index) => index));
  const lastCellRef = useRef(-1);

  useEffect(() => {
    companies.forEach((company) => {
      const image = new window.Image();
      image.src = company.logo;
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const timer = window.setInterval(() => {
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
                <div className="portfolio-logo-cell" key={cellIndex}>
                  <div className="portfolio-logo-flip" key={`${cellIndex}-${logoIndexes[cellIndex]}`}>
                    <Image unoptimized src={company.logo} alt={company.name} width={company.width} height={company.height} sizes="(max-width: 650px) 46vw, 290px" />
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
            <a className="button button-primary" href="/portfolio">
              View Portfolio <span aria-hidden="true">→</span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
