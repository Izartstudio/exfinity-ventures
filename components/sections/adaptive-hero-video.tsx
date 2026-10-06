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
    const mobileQuery = window.matchMedia("(max-width: 650px)");
    let selectedSource = "";

    const updateSource = () => {
      const nextSource = mobileQuery.matches
        ? slowConnection ? "/videos/hero-final-mobile-480.mp4" : "/videos/hero-final-mobile-720.mp4"
        : slowConnection ? "/videos/hero-final-480.mp4" : "/videos/hero-final-720.mp4";

      if (nextSource === selectedSource) return;
      selectedSource = nextSource;
      video.classList.add("is-switching");
      video.src = nextSource;
      video.load();
    };

    const resumeVideo = () => {
      video.classList.remove("is-switching");
      void video.play().catch(() => undefined);
    };

    video.addEventListener("canplay", resumeVideo);
    mobileQuery.addEventListener("change", updateSource);
    updateSource();

    return () => {
      video.removeEventListener("canplay", resumeVideo);
      mobileQuery.removeEventListener("change", updateSource);
    };
  }, []);

  return <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/videos/hero-poster.jpg" aria-hidden="true" />;
}
