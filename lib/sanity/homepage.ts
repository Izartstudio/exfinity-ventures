import { fallbackFounders } from "@/content/homepage-founders";
import { getPublishedSection } from "./sections";
import type { HomepageFoundersSection, HomepageStat } from "@/types/homepage";

const fallbackStats: HomepageStat[] = [
  { value: "40+", label: "Companies Across The Portfolio" },
  { value: "$4.5B+", label: "Enterprise Value Created Across The Portfolio" },
  { value: "300+", label: "Patents Filed Across The Portfolio" },
];

type StatsResponse = { result?: { stats?: HomepageStat[] } };

export async function getHomepageStats(): Promise<HomepageStat[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return fallbackStats;

  const query = encodeURIComponent(
    `*[_type == "homepageStats"][0]{"stats": stats[]{value,label}}`,
  );
  const url = `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallbackStats;
    const data = (await response.json()) as StatsResponse;
    const stats = data.result?.stats?.filter((stat) => stat.value && stat.label);
    return stats?.length ? stats : fallbackStats;
  } catch {
    return fallbackStats;
  }
}

export async function getHomepageFounders(): Promise<HomepageFoundersSection> {
  const data = await getPublishedSection<HomepageFoundersSection>("homepageFounders", `heading,layout,"founders":founders[]{name,role,quote,"imageUrl":coalesce(image.asset->url,imageUrl),"logoUrl":coalesce(logo.asset->url,logoUrl)}`);
  const fallback: HomepageFoundersSection = { heading: "What Our Founders Say", layout: "three", founders: fallbackFounders };
  if (!data?.founders?.length || !data.founders.every((founder) => founder.name && founder.role && founder.quote && founder.imageUrl)) return fallback;
  return { heading: data.heading || fallback.heading, layout: data.layout === "five" ? "five" : "three", founders: data.founders.map((founder) => ({ ...founder, logoUrl: founder.logoUrl || fallbackFounders.find((item) => item.name === founder.name)?.logoUrl })) };
}
