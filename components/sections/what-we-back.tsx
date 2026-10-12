"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { BackingSection } from "@/content/homepage-sections";
type Card = BackingSection["cards"][number];

export function WhatWeBack({ content }: { content: BackingSection }) {
  const { cards } = content;
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
      <div className="section-kicker"><span>{content.kicker}</span></div>
      <div className="section-intro"><div><h2 id="what-we-back-title">{content.heading}</h2><p>{content.description}</p></div><Link className="button button-primary" href={content.ctaHref}><span className="button-label">{content.ctaLabel}</span></Link></div>
      <div className="backing-grid" id="portfolio-grid">{cards.map((card) => <article className={`backing-card backing-card-${card.id}`} key={card.id}><Image src={card.image} alt="" fill sizes={card.id === "b2b" ? "(max-width: 650px) 100vw, 95vw" : "(max-width: 650px) 100vw, 48vw"} /><button className="backing-toggle" type="button" onClick={() => { closingRef.current = false; setIsClosing(false); setOpenPanel("about"); setActive(card); }} aria-haspopup="dialog"><span>{card.title}</span><span className="button button-light card-cta"><span className="button-label">{content.readMoreLabel}</span></span></button></article>)}</div>
    </div></section>

    {active && <div className={`modal-backdrop${isClosing ? " modal-closing" : ""}`} data-lenis-prevent role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
      <section className="backing-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={closeButtonRef} className="modal-close" type="button" onClick={closeModal} aria-label="Close popup">×</button>
        <div className="modal-visual">
          <Image src={active.image} alt="" fill sizes="330px" priority />
          <h2 id="modal-title">{active.title}</h2>
          <div className="modal-pagination"><button type="button" onClick={() => move(-1)} aria-label="Previous category">‹</button><span><strong>0{activeIndex + 1}</strong><b>/</b><em>{String(cards.length).padStart(2, "0")}</em></span><button type="button" onClick={() => move(1)} aria-label="Next category">›</button></div>
        </div>
        <div className="modal-copy">
          <details className="modal-accordion" open={openPanel === "about"}>
            <summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "about" ? null : "about"); }}><span>{content.aboutLabel}</span><i className="accordion-chevron" aria-hidden="true" /></summary>
            <p className="modal-about-lead">“{active.aboutLead}”</p>
            <p>{active.copy}</p>
          </details>
          <details className="modal-accordion" open={openPanel === "themes"}>
            <summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "themes" ? null : "themes"); }}><span>{content.themesLabel}</span><i className="accordion-chevron" aria-hidden="true" /></summary>
            <ul className="theme-list">{active.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
          </details>
        </div>
        <div className={`company-grid company-grid-${active.companies.length}`} aria-label={`${active.title} companies`}>{active.companies.map((company) => <Link className="company-logo-cell" data-company={company.name.toLowerCase()} href={company.href} key={company.name} onClick={closeModal}>
          <Image className="company-logo-image company-logo-image-color" src={company.logo} alt={company.name} width={280} height={280} quality={90} />
          <Image className="company-logo-image company-logo-image-white" src={company.logoWhite} alt="" width={280} height={280} quality={90} />
        </Link>)}</div>
      </section>
    </div>}
  </>;
}
