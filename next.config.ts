import type { NextConfig } from "next";
import archive from "./content/news-archive.json";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90, 100],
    minimumCacheTTL: 2_592_000,
  },
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "exfinityventures.com" }], destination: "https://www.exfinityventures.com/:path*", permanent: true },
      ...archive.map(article => ({ source: article.legacyPath, destination: article.slug, permanent: true })),
      { source: "/our-team", destination: "/team", permanent: true },
      { source: "/people", destination: "/team", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/team", permanent: true },
      { source: "/legacy", destination: "/", permanent: true },
      { source: "/fund-iv", destination: "/news/fund-four", permanent: true },
      { source: "/aif-registration", destination: "/aif-registration-details", permanent: true },
      { source: "/terms", destination: "/", permanent: true },
      { source: "/privacy", destination: "/", permanent: true },
      { source: "/media/:slug", destination: "/news", permanent: true },
      { source: "/portfolio/ati-motors", destination: "/portfolio/ati", permanent: true },
      { source: "/portfolio/maieutic-semiconductors", destination: "/portfolio/maieutic", permanent: true },
      { source: "/portfolio/neuralgarage", destination: "/portfolio/neural-garage", permanent: true },
      { source: "/portfolio/rezolve-ai", destination: "/portfolio/resolve-ai", permanent: true },
      { source: "/portfolio/unscript-ai", destination: "/portfolio/unscript", permanent: true },
    ];
  },
};

export default nextConfig;
