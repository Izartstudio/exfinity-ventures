"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const cards = [
  {
    id: "deeptech",
    title: "DeepTech",
    image: "/what-we-back/deeptech.png",
    copy: "Companies built on deep scientific or engineering advancements, where the barrier is physics, chemistry, or biology, not features. We invest once TRL 3–4 has been crossed and the remaining risk is commercial, backing teams that leverage India’s engineering depth to achieve the same outcomes at a fraction of Western costs.",
    companies: ["Kinara", "Ati Robotics", "Maieutic", "Chara", "Optimized Electrotech", "Str8bat"],
  },
  {
    id: "ai-native",
    title: "AI Native Software",
    image: "/what-we-back/ai-native.png",
    copy: "Companies where artificial intelligence is the product architecture, not an added feature. We partner with founders building intelligent systems that learn, adapt and create durable advantages across enterprise workflows and global markets.",
    companies: ["AI Infrastructure", "Enterprise AI", "Agentic Systems", "Data Platforms", "Vertical AI", "Developer Tools"],
  },
  {
    id: "b2b",
    title: "B2B Platforms",
    image: "/what-we-back/b2b-platforms.png",
    copy: "Technology-led platforms that solve complex business problems with strong product foundations and clear market insight. We back ambitious teams building scalable, defensible businesses for customers in India and around the world.",
    companies: ["SaaS", "Industry Platforms", "Cloud Software", "Automation", "Infrastructure", "Enterprise Systems"],
  },
] as const;

type Card = (typeof cards)[number];

export function WhatWeBack() {
  const [active, setActive] = useState<Card | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [themesOpen, setThemesOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setActive(null);
      setIsClosing(false);
    }, 360);
  }, [isClosing]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [active, closeModal]);

  const activeIndex = active ? cards.findIndex((card) => card.id === active.id) : -1;
  const move = (direction: -1 | 1) => {
    const next = (activeIndex + direction + cards.length) % cards.length;
    setActive(cards[next]);
  };

  return <>
    <section className="what-we-back" id="portfolio" aria-labelledby="what-we-back-title"><div className="container">
      <div className="section-kicker"><span>What we back</span></div>
      <div className="section-intro"><div><h2 id="what-we-back-title">The Frontiers We Invest In</h2><p>We invest across three areas. Each demands deep expertise to build and has the potential to create durable advantage at scale.</p></div><a className="button button-primary" href="#portfolio-grid">View portfolio <span aria-hidden="true">→</span></a></div>
      <div className="backing-grid" id="portfolio-grid">{cards.map((card) => <article className={`backing-card backing-card-${card.id}`} key={card.id}><Image src={card.image} alt="" fill sizes={card.id === "b2b" ? "(max-width: 650px) 100vw, 95vw" : "(max-width: 650px) 100vw, 48vw"} /><button className="backing-toggle" type="button" onClick={() => { setIsClosing(false); setAboutOpen(true); setThemesOpen(false); setActive(card); }} aria-haspopup="dialog"><span>{card.title}</span><span className="card-cta">Read more <span aria-hidden="true">→</span></span></button></article>)}</div>
    </div></section>

    {active && <div className={`modal-backdrop${isClosing ? " modal-closing" : ""}`} data-lenis-prevent role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
      <section className="backing-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={closeButtonRef} className="modal-close" type="button" onClick={closeModal} aria-label="Close popup">×</button>
        <div className="modal-visual">
          <Image src={active.image} alt="" fill sizes="330px" priority />
          <h2 id="modal-title">{active.title}</h2>
          <div className="modal-pagination"><button type="button" onClick={() => move(-1)} aria-label="Previous category">‹</button><span><strong>0{activeIndex + 1}</strong> / 03</span><button type="button" onClick={() => move(1)} aria-label="Next category">›</button></div>
        </div>
        <div className="modal-copy">
          <details className="modal-accordion" open={aboutOpen} onToggle={(event) => setAboutOpen(event.currentTarget.open)}>
            <summary><span>About</span><i className="accordion-chevron" aria-hidden="true" /></summary>
            <p>{active.copy}</p>
          </details>
          <details className="modal-accordion" open={themesOpen} onToggle={(event) => setThemesOpen(event.currentTarget.open)}>
            <summary><span>Select themes</span><i className="accordion-chevron" aria-hidden="true" /></summary>
            <p>Focused themes within {active.title} reflect the opportunities where Exfinity brings the strongest expertise and network.</p>
          </details>
        </div>
        <div className="company-grid" aria-label={`${active.title} themes`}>{active.companies.map((company) => <div key={company}>{company}</div>)}</div>
      </section>
    </div>}
  </>;
}
