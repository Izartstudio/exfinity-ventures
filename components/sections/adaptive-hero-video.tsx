"use client";

import { useEffect, useRef } from "react";

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

export function AdaptiveHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slowConnection = connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g" || connection?.effectiveType === "3g";
    const isMobile = window.matchMedia("(max-width: 650px)").matches;

    if (isMobile) {
      video.src = slowConnection ? "/videos/hero-final-mobile-480.mp4" : "/videos/hero-final-mobile-720.mp4";
    } else {
      video.src = slowConnection ? "/videos/hero-final-480.mp4" : "/videos/hero-final-720.mp4";
    }
    video.load();
    void video.play().catch(() => undefined);
  }, []);

  return <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/videos/hero-poster.jpg" aria-hidden="true" />;
}
