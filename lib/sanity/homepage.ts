import { fallbackFounders } from "@/content/homepage-founders";
import { getPublishedSection } from "./sections";
import type { HomepageFoundersSection, HomepageStat } from "@/types/homepage";

export const fallbackStats: HomepageStat[] = [
  { value: "40+", label: "Companies Across The Portfolio" },
  { value: "$4.5B+", label: "Enterprise Value Created Across The Portfolio" },
  { value: "300+", label: "Patents Filed Across The Portfolio" },
];

export async function getHomepageStats(): Promise<HomepageStat[]> {
  const data = await getPublishedSection<{ stats: HomepageStat[] }>("homepageStats", "stats[]{value,label}");
  return data ? (data.stats ?? []).filter((stat) => stat.value && stat.label) : fallbackStats;
}

export async function getHomepageFounders(): Promise<HomepageFoundersSection> {
  const data = await getPublishedSection<HomepageFoundersSection>("homepageFounders", `heading,layout,"founders":founders[]{name,role,quote,"imageUrl":coalesce(image.asset->url,imageUrl),"logoUrl":coalesce(logo.asset->url,logoUrl)}`);
  const fallback: HomepageFoundersSection = { heading: "What Our Founders Say", layout: "three", founders: fallbackFounders };
  if (!data) return fallback;
  return {
    heading: data.heading || fallback.heading,
    layout: data.layout === "five" ? "five" : "three",
    founders: (data.founders ?? []).filter((founder) => founder.name && founder.role && founder.quote && founder.imageUrl),
  };
}
