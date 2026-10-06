"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import type { PortfolioCompany } from "@/content/portfolio";

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return <div className="company-detail-row"><dt>{label}</dt><dd>{children}</dd></div>;
}

export function CompanyDetail({ company }: { company: PortfolioCompany }) {
  const factsRef = useRef<HTMLDListElement>(null);
  const dragOffset = useRef(0);
  const [scrollbar, setScrollbar] = useState({ height: 100, top: 0 });

  useEffect(() => {
    const facts = factsRef.current;
    if (!facts) return;

    const updateScrollbar = () => {
      const viewport = facts.clientHeight;
      const content = facts.scrollHeight;
      const height = content > viewport ? Math.max(44, (viewport / content) * viewport) : viewport;
      const available = Math.max(0, viewport - height);
      const progress = content > viewport ? facts.scrollTop / (content - viewport) : 0;
      setScrollbar({ height, top: available * progress });
    };

    updateScrollbar();
    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(facts);
    facts.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);
    return () => {
      observer.disconnect();
      facts.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
    };
  }, []);

  const moveScrollbar = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const facts = factsRef.current;
    if (!facts) return;
    const track = event.currentTarget.getBoundingClientRect();
    const maxThumbTop = Math.max(0, track.height - scrollbar.height);
    const thumbTop = Math.max(0, Math.min(maxThumbTop, event.clientY - track.top - dragOffset.current));
    const maxScroll = facts.scrollHeight - facts.clientHeight;
    facts.scrollTop = maxThumbTop > 0 ? (thumbTop / maxThumbTop) * maxScroll : 0;
  };

  const startScrollbarDrag = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const track = event.currentTarget.getBoundingClientRect();
    const localY = event.clientY - track.top;
    const clickedThumb = localY >= scrollbar.top && localY <= scrollbar.top + scrollbar.height;
    dragOffset.current = clickedThumb ? localY - scrollbar.top : scrollbar.height / 2;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveScrollbar(event);
  };

  return <section className="company-detail" aria-labelledby="company-detail-title">
    <div className="company-detail-layout">
      <div className="company-detail-visual">
        <Link className="company-back" href="/portfolio"><span aria-hidden="true">‹</span> Back to portfolio</Link>
        <div className="company-detail-visual-logo">
          {company.logo ? <Image src={company.logo} alt={company.name} width={320} height={150} unoptimized /> : <span>{company.name}</span>}
        </div>
      </div>
      <div className="company-detail-copy">
        <div className="company-detail-title-row">
          <div>
            <h1 id="company-detail-title">{company.name}</h1>
            {company.tagline && <h2>{company.tagline}</h2>}
          </div>
          <div className="company-detail-socials">
            {company.linkedinUrl && <a href={company.linkedinUrl} target="_blank" rel="noreferrer" aria-label={`${company.name} on LinkedIn`}><Image src="/icons/company-linkedin.svg" alt="" width={24} height={24} /></a>}
            {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" aria-label={`${company.name} website`}><Image src="/icons/company-web.svg" alt="" width={24} height={24} /></a>}
          </div>
        </div>
        {company.description && <p className="company-description">{company.description}</p>}
        <div className="company-facts-shell">
          <dl className="company-facts" ref={factsRef} tabIndex={0}>
            <DetailRow label="Partnered since"><div className="company-pills">{company.partneredSince && <span>{company.partneredSince}</span>}{company.entryStage && <span>{company.entryStage}</span>}</div></DetailRow>
            <DetailRow label="Fund">{[company.fund, ...(company.additionalFunds || [])].map((fund) => fund.replace("Fund IV", "Fund 4").replace("Fund III", "Fund 3").replace("Fund II", "Fund 2").replace("Fund I", "Fund 1")).join(", ")}</DetailRow>
            <DetailRow label="Theme">{company.theme || company.sector}</DetailRow>
            {company.theme && <DetailRow label="Sector">{company.sector}</DetailRow>}
            <DetailRow label="Company status"><span className="company-status-pill">{company.status}</span></DetailRow>
            {!!company.founders?.length && <DetailRow label="Founders"><span className="company-name-list">{company.founders.join("\n")}</span></DetailRow>}
            {!!company.exfinityTeam?.length && <DetailRow label="Exfinity team"><span className="company-name-list">{company.exfinityTeam.join("\n")}</span></DetailRow>}
          </dl>
          <span className="company-facts-scrollbar" aria-hidden="true" onPointerDown={startScrollbarDrag} onPointerMove={moveScrollbar} onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)} onPointerCancel={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}><i style={{ height: `${scrollbar.height}px`, transform: `translateY(${scrollbar.top}px)` }} /></span>
        </div>
      </div>
    </div>
  </section>;
}
