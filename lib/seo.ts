import type { Metadata } from "next";

export const siteUrl = "https://www.exfinityventures.com";
export const siteName = "Exfinity Venture Partners";
export const defaultDescription =
  "Exfinity Venture Partners backs globally ambitious founders building category-defining DeepTech, AI-native software and B2B platforms from India.";
export const socialImage = "/videos/hero-poster.jpg";

export function createMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      type: "website",
      locale: "en_IN",
      images: [{ url: socialImage, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
