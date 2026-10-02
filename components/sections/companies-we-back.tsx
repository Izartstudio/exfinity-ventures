"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const companies = [
  { name: "Maieutic", logo: "/companies/maieutic.png", width: 190, height: 90 },
  { name: "RagaAI", logo: "/companies/raga-ai.png", width: 190, height: 90 },
  { name: "Ati Motors", logo: "/companies/ati.png", width: 130, height: 90 },
  { name: "Pixis", logo: "/companies/pixis.png", width: 190, height: 90 },
  { name: "MoEngage", logo: "/companies/moengage.png", width: 190, height: 90 },
  { name: "Chara", logo: "/companies/chara.png", width: 190, height: 90 },
] as const;

export function CompaniesWeBack() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const timer = window.setInterval(() => {
      setRotation((current) => (current + 1) % companies.length);
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
            {companies.map((_, cellIndex) => {
              const company = companies[(cellIndex + rotation) % companies.length];

              return (
                <div className="portfolio-logo-cell" key={cellIndex}>
                  <div className="portfolio-logo-flip" key={`${cellIndex}-${rotation}`}>
                    <Image src={company.logo} alt={company.name} width={company.width} height={company.height} sizes="(max-width: 650px) 34vw, 160px" />
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
