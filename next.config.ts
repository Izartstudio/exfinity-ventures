import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "exfinityventures.com" }], destination: "https://www.exfinityventures.com/:path*", permanent: true },
      { source: "/our-team", destination: "/team", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/team", permanent: true },
      { source: "/legacy", destination: "/", permanent: true },
      { source: "/fund-iv", destination: "/news/fund-four", permanent: true },
      { source: "/aif-registration", destination: "/", permanent: true },
      { source: "/aif-registration-details", destination: "/", permanent: true },
      { source: "/terms", destination: "/", permanent: true },
      { source: "/privacy", destination: "/", permanent: true },
      { source: "/media/exfinity-inside-india-2026-danish-delegation", destination: "/news/inside-india-2026", permanent: true },
      { source: "/media/exfinity-fund-iv-1100-crore-deep-tech", destination: "/news/fund-four", permanent: true },
      { source: "/media/cloudsek-first-indian-origin-cybersecurity-us-state-fund-investment", destination: "/news/cloudsek-state-fund", permanent: true },
      { source: "/media/chara-technologies-raises-rs-52-crore-to-expand-rare-earth-free-motor-manufacturing", destination: "/news/chara-series-a", permanent: true },
      { source: "/media/ikea-arm-acquires-india-born-logistics-tech-startup-locus", destination: "/news/ikea-locus", permanent: true },
      { source: "/media/exf-physical-ai", destination: "/news", permanent: true },
      { source: "/media/:slug", destination: "/news", permanent: true },
      { source: "/portfolio/ati-motors", destination: "/portfolio/ati", permanent: true },
      { source: "/portfolio/maieutic-semiconductors", destination: "/portfolio/maieutic", permanent: true },
      { source: "/portfolio/neuralgarage", destination: "/portfolio/neural-garage", permanent: true },
    ];
  },
};

export default nextConfig;
