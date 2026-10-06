"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import type { HomepageFounder } from "@/types/homepage";

export function OurFounders({ founders }: { founders: HomepageFounder[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    if (!entered || isHovered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHasAdvanced(true);
      setActive((current) => (current + 1) % founders.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [entered, founders.length, isHovered]);

  const activeFounder = founders[active];

  return (
    <section
      ref={sectionRef}
      className={`our-founders${entered ? " is-visible" : ""}`}
      aria-labelledby="founders-title"
    >
      <svg className="founders-paths" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <path className="founders-ellipse founders-ellipse-left" d="M0 790 A720 720 0 0 1 720 70" pathLength="1" />
        <path className="founders-ellipse founders-ellipse-right" d="M720 70 A720 720 0 0 1 1440 790" />
        <path className="founders-stroke founders-stroke-top" d="M720 58 V150 M720 250 V310" pathLength="1" />
      </svg>
      <span className="founders-node" aria-hidden="true" />

      <div className="container founders-content">
        <h2 id="founders-title">What Our Founders Say</h2>

        <div className="founders-ticker" aria-live="off" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {founders.map((founder, index) => {
            let offset = (index - active + founders.length) % founders.length;
            if (offset > founders.length / 2) offset -= founders.length;
            const visibleOffset = Math.max(-2, Math.min(2, offset));
            const isVisible = Math.abs(offset) <= 2;
            const isEntering = hasAdvanced && visibleOffset === 2 && isVisible;

            return (
              <figure
                className={`founder-portrait founder-slot-${visibleOffset}${index === active ? " is-active" : ""}${isEntering ? " is-entering" : ""}`}
                key={`${founder.name}-${index}`}
                aria-hidden={index !== active}
                style={{ opacity: isVisible ? 1 : 0, zIndex: index === active ? 3 : 1 }}
              >
                <img className="founder-photo" src={founder.imageUrl} alt={index === active ? founder.name : ""} />
                {founder.logoUrl && <span className="founder-company-logo"><img src={founder.logoUrl} alt="" /></span>}
              </figure>
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
