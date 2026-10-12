"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { founderSlot, type HomepageFoundersSection } from "@/types/homepage";

export function OurFounders({ content }: { content: HomepageFoundersSection }) {
  const { founders, layout } = content;
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isPaused = isHovered;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!entered || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % founders.length);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [active, entered, founders.length, isPaused]);

  const activeFounder = founders[active];

  return (
    <section
      ref={sectionRef}
      className={`our-founders founders-layout-${layout}${entered ? " is-visible" : ""}`}
      aria-labelledby="founders-title"
      data-paused={isPaused}

    >
      <svg className="founders-paths" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <path className="founders-ellipse founders-ellipse-left" d="M0 790 A720 720 0 0 1 720 70" pathLength="1" />
        <path className="founders-ellipse founders-ellipse-right" d="M720 70 A720 720 0 0 1 1440 790" />
        <path className="founders-stroke founders-stroke-top" d="M720 58 V150 M720 250 V310" pathLength="1" />
      </svg>
      <span className="founders-node" aria-hidden="true" />

      <div className="container founders-content">
        <h2 id="founders-title">{content.heading}</h2>

        <div className="founders-ticker" aria-live="off">
          {founders.map((founder, index) => {
            const { offset: visibleOffset, visible: isVisible } = founderSlot(index, active, founders.length, layout);

            return (
              <button
                className={`founder-portrait founder-slot-${visibleOffset}${index === active ? " is-active" : ""}${isVisible && index !== active ? " is-selectable" : ""}`}
                type="button"
                key={`${founder.name}-${index}`}
                aria-hidden={!isVisible}
                aria-label={index === active ? undefined : `Show testimonial from ${founder.name}`}
                aria-pressed={index === active}
                tabIndex={isVisible && index !== active ? 0 : -1}
                onMouseEnter={() => { if (isVisible) setIsHovered(true); }}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                  if (index !== active && isVisible) setActive(index);
                }}
                style={{ opacity: isVisible ? 1 : 0, zIndex: index === active ? 3 : 1 }}
              >
                <Image className="founder-photo" src={founder.imageUrl} alt={isVisible ? founder.name : ""} fill quality={90} sizes="(max-width: 650px) 43vw, (max-width: 1100px) 24vw, 20vw" />
                {index === active && founder.logoUrl && <span className="founder-company-logo"><Image src={founder.logoUrl} alt="" fill unoptimized sizes="(max-width: 650px) 112px, 180px" /></span>}
              </button>
            );
          })}
        </div>

        <div className="founder-testimonial" key={`${activeFounder.name}-${active}`}>
          <h3>{activeFounder.name}</h3>
          <p className="founder-role">{activeFounder.role}</p>
          <blockquote>“{activeFounder.quote}”</blockquote>
        </div>
      </div>
    </section>
  );
}
