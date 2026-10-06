"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const cards = [
  {
    id: "deeptech",
    title: "DeepTech",
    image: "/what-we-back/deeptech.png",
    copy: "Companies that turn hard science into products protected by proprietary IP, complex engineering, and years of R&D. Their moat is structural as competitors need science, talent, and time to catch up.",
    themes: ["Semiconductors & Computing", "Aerospace", "Advanced Materials & Manufacturing", "Energy & Climate Tech", "Robotics & Automation", "Defence & Dual-Use Technology", "Life Sciences"],
    companies: [
      { name: "Kinara", logo: "/companies/popup/kinara-provided.png", href: "/portfolio/kinara" },
      { name: "Ati Robotics", logo: "/companies/popup/ati.png", href: "/portfolio/ati" },
      { name: "Maieutic", logo: "/companies/portfolio-provided/maieutic.svg", href: "/portfolio/maieutic" },
      { name: "Chara", logo: "/companies/popup/chara.png", href: "/portfolio/chara" },
      { name: "Optimized Electrotech", logo: "/companies/popup/optimized-electrotech-provided.png", href: "/portfolio/optimized-electrotech" },
      { name: "Str8bat", logo: "/companies/popup/str8bat-provided.png", href: "/portfolio/str8bat" },
    ],
  },
  {
    id: "ai-native",
    title: "AI Native Software",
    image: "/what-we-back/ai-native.png",
    copy: "Products where intelligence is the core, using AI models and proprietary data to automate decisions and uncover insights at scale. Their moat grows with every use, as better data builds better models and deeper customer lock-in. The stack that helps build these self-learning products is also a part of this thesis.",
    themes: ["AI Agents & Autonomous Systems", "AI Infrastructure", "AI Developer Tools", "Data & ML Infrastructure", "AI Evals & Security", "Cybersecurity", "Vertical AI"],
    companies: [
      { name: "Pixis", logo: "/companies/popup/pixis.png", href: "/portfolio/pixis" },
      { name: "CloudSEK", logo: "/companies/popup/cloudsek.png", href: "/portfolio/cloudsek" },
      { name: "MoEngage", logo: "/companies/popup/moengage-provided.png", href: "/portfolio/moengage" },
      { name: "Locus", logo: "/companies/popup/locus.png", href: "/portfolio/locus" },
      { name: "NeuralGarage", logo: "/companies/popup/neural-garage.png", href: "/portfolio/neural-garage" },
      { name: "Eccentric", logo: "/companies/popup/eccentric.png", href: "/portfolio/eccentric" },
    ],
  },
  {
    id: "b2b",
    title: "B2B Platforms",
    image: "/what-we-back/b2b-platforms.png",
    copy: "Platforms that bring fragmented businesses together or provide a unique product, with deep domain know-how and operational expertise built into every workflow. Their moat combines network effects with institutional knowledge that competitors can't copy.",
    themes: ["Industrial Platforms", "Health Technology", "AI Native Services"],
    companies: [
      { name: "Zyla", logo: "/companies/popup/zyla.png", href: "/portfolio/zyla-health" },
      { name: "Autoverse", logo: "/companies/popup/autoverse.png", href: "/portfolio/autoverse" },
      { name: "Credilio", logo: "/companies/popup/credilio.png", href: "/portfolio/credilio" },
      { name: "Skit", logo: "/companies/popup/skit.png", href: "/portfolio/skit-ai" },
    ],
  },
] as const;

type Card = (typeof cards)[number];

export function WhatWeBack() {
  const [active, setActive] = useState<Card | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [openPanel, setOpenPanel] = useState<"about" | "themes" | null>("about");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  const closeModal = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setActive(null);
      setIsClosing(false);
      closingRef.current = false;
      closeTimerRef.current = null;
    }, 360);
  }, []);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("exfinity:scroll-lock"));
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event("exfinity:scroll-unlock"));
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [active, closeModal]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("exfinity:scroll-unlock"));
  }, []);

  const activeIndex = active ? cards.findIndex((card) => card.id === active.id) : -1;
  const move = (direction: -1 | 1) => {
    const next = (activeIndex + direction + cards.length) % cards.length;
    setActive(cards[next]);
  };

  return <>
    <section className="what-we-back" id="portfolio" aria-labelledby="what-we-back-title"><div className="container">
      <div className="section-kicker"><span>What we back</span></div>
      <div className="section-intro"><div><h2 id="what-we-back-title">The Frontiers We Invest In</h2><p>We invest across three areas. Each demands deep expertise to build and has the potential to create durable advantage at scale.</p></div><Link className="button button-primary" href="/portfolio">View portfolio <span aria-hidden="true">→</span></Link></div>
      <div className="backing-grid" id="portfolio-grid">{cards.map((card) => <article className={`backing-card backing-card-${card.id}`} key={card.id}><Image src={card.image} alt="" fill sizes={card.id === "b2b" ? "(max-width: 650px) 100vw, 95vw" : "(max-width: 650px) 100vw, 48vw"} /><button className="backing-toggle" type="button" onClick={() => { closingRef.current = false; setIsClosing(false); setOpenPanel("about"); setActive(card); }} aria-haspopup="dialog"><span>{card.title}</span><span className="button button-light card-cta">Read more <span aria-hidden="true">→</span></span></button></article>)}</div>
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
          <details className="modal-accordion" open={openPanel === "about"}>
            <summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "about" ? null : "about"); }}><span>About</span><i className="accordion-chevron" aria-hidden="true" /></summary>
            <p>{active.copy}</p>
          </details>
          <details className="modal-accordion" open={openPanel === "themes"}>
            <summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "themes" ? null : "themes"); }}><span>Select themes</span><i className="accordion-chevron" aria-hidden="true" /></summary>
            <ul className="theme-list">{active.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
          </details>
        </div>
        <div className={`company-grid company-grid-${active.companies.length}`} aria-label={`${active.title} companies`}>{active.companies.map((company) => <Link className="company-logo-cell" data-company={company.name.toLowerCase()} href={company.href} key={company.name} onClick={closeModal}>
          <Image className="company-logo-image" src={company.logo} alt={company.name} width={280} height={280} unoptimized />
        </Link>)}</div>
      </section>
    </div>}
  </>;
}
