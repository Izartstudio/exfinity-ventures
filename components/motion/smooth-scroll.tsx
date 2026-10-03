"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("exfinity:scroll-lock", stop);
    window.addEventListener("exfinity:scroll-unlock", start);

    return () => {
      window.removeEventListener("exfinity:scroll-lock", stop);
      window.removeEventListener("exfinity:scroll-unlock", start);
      lenis.destroy();
    };
  }, []);

  return null;
}
