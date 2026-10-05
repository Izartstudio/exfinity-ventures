"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Founders with Global Vision",
    description:
      "We back founders who build for global markets from day one; companies engineered in India to compete and win globally.",
  },
  {
    number: "02",
    title: "Teams with Technical and operational Depth",
    description:
      "We look for the founding team with technical authority and operating capability.",
  },
  {
    number: "03",
    title: "Companies with Market validation",
    description:
      "A first customer, signed POC, or an enterprise partnership can accelerate our journey.",
  },
] as const;

export function InvestmentPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const previousProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [firstAnimationComplete, setFirstAnimationComplete] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.001 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered || firstAnimationComplete) return;
    const timer = window.setTimeout(() => setFirstAnimationComplete(true), 1100);
    return () => window.clearTimeout(timer);
  }, [hasEntered, firstAnimationComplete]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, -rect.top / distance));
      if (nextProgress !== previousProgressRef.current) {
        setIsScrollingDown(nextProgress > previousProgressRef.current);
        previousProgressRef.current = nextProgress;
        setProgress(nextProgress);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const activeIndex = Math.min(2, Math.floor(progress * steps.length));
  const stateStart = activeIndex / steps.length;
  const stateProgress = Math.min(1, Math.max(0, (progress - stateStart) * steps.length));
  const mappedProgress = (activeIndex + stateProgress) / steps.length;
  const activeStep = steps[activeIndex];

  return <section ref={sectionRef} className={`philosophy-scroll${hasEntered ? " is-entered" : ""}${firstAnimationComplete ? " first-animation-complete" : ""}${isScrollingDown ? " is-scrolling-down" : ""}`} aria-labelledby="philosophy-title">
    <div className="philosophy-sticky">
      <h2 id="philosophy-title">Investment Philosophy</h2>
      <div className={`philosophy-art stage-${activeIndex + 1}`}>
        <svg viewBox="0 0 1440 620" aria-hidden="true">
          <line className="philosophy-line-base" x1="75" y1="310" x2="1365" y2="310" />
          <line className="philosophy-line-active left" x1="345" y1="310" x2="445" y2="310" />
          <line className="philosophy-line-active right" x1="995" y1="310" x2="1095" y2="310" />
          <circle className="philosophy-circle-fill" cx="720" cy="310" r="274" />
          <path className="philosophy-circle-side" d="M 499 148 A 274 274 0 0 0 499 472" pathLength="1" />
          <path className="philosophy-circle-side" d="M 941 148 A 274 274 0 0 1 941 472" pathLength="1" />
          <path className="philosophy-circle-cap cap-top-left" d="M 499 148 A 274 274 0 0 1 720 36" pathLength="1" />
          <path className="philosophy-circle-cap cap-top-right" d="M 941 148 A 274 274 0 0 0 720 36" pathLength="1" />
          <path className="philosophy-circle-cap cap-bottom-left" d="M 499 472 A 274 274 0 0 0 720 584" pathLength="1" />
          <path className="philosophy-circle-cap cap-bottom-right" d="M 941 472 A 274 274 0 0 1 720 584" pathLength="1" />
        </svg>
        <div className="philosophy-copy" key={activeStep.number}>
          <span>{activeStep.number}</span>
          <h3>{activeStep.title}</h3>
          <p>{activeStep.description}</p>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span className="scroll-cue-track"><i style={{ transform: `scaleY(${mappedProgress})` }} /></span>
        <span>Scroll</span>
      </div>
    </div>
  </section>;
}
