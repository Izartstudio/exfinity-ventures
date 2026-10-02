"use client";

import { useEffect } from "react";

const revealSelector = [
  "main > section:not(.hero):not(.philosophy-scroll) h2",
  "main > section:not(.hero):not(.philosophy-scroll) h3",
  "main > section:not(.hero):not(.philosophy-scroll) p",
  "main > section:not(.hero):not(.philosophy-scroll) .button",
  ".backing-card",
  ".stat-card",
  ".invest-principle",
  ".portfolio-logo-cell",
  ".insight-card",
  ".thesis-card > img",
  ".pre-footer-content > *",
  ".footer-newsletter > *",
  ".footer-links > div",
  ".footer-brand",
  ".footer-contact > div",
].join(",");

export function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("reveal-visible"));
      return;
    }

    elements.forEach((element, index) => {
      element.classList.add("reveal-item", `reveal-delay-${index % 4}`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5%" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
