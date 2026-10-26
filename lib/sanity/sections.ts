import { backingDefaults, companiesDefaults, type BackingSection, type CompaniesSection } from "@/content/homepage-sections";
import { unstable_rethrow } from "next/navigation";

export async function getPublishedSection<T>(type: string, projection: string): Promise<T | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  const query = encodeURIComponent(`*[_type == "${type}" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{${projection}}`);
  try {
    const response = await fetch(`https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}&perspective=published`, {
      cache: "no-store", signal: AbortSignal.timeout(10000),
      ...(process.env.SANITY_API_READ_TOKEN ? { headers: { Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}` } } : {}),
    });
    if (!response.ok) throw new Error(`CMS response ${response.status}`);
    const data = await response.json();
    return data.result ?? null;
  } catch (error) {
    unstable_rethrow(error);
    console.error(`Sanity ${type} unavailable; using local fallback.`);
    return null;
  }
}

export async function getHomepageCompanies(): Promise<CompaniesSection> {
  const data = await getPublishedSection<CompaniesSection>("homepageCompanies", `heading,description,ctaLabel,ctaHref,companies[]{name,href,"logo":coalesce(logoImage.asset->url,logo),"width":coalesce(width,150),"height":coalesce(height,50)}`);
  if (!data) return companiesDefaults;
  data.companies = (data.companies ?? []).filter((c) => c.name && c.href && c.logo);
  return { ...companiesDefaults, ...Object.fromEntries(Object.entries(data).filter(([, value]) => value != null)) } as CompaniesSection;
}

export async function getHomepageBacking(): Promise<BackingSection> {
  const data = await getPublishedSection<BackingSection>("homepageBacking", `kicker,heading,description,ctaLabel,ctaHref,readMoreLabel,aboutLabel,themesLabel,cards[]{id,title,"image":coalesce(cardImage.asset->url,image),aboutLead,copy,themes,companies[]{name,href,"logo":coalesce(logoImage.asset->url,logo),"logoWhite":coalesce(whiteLogoImage.asset->url,logoWhite,logoImage.asset->url,logo)}}`);
  if (!data) return backingDefaults;
  data.cards = (data.cards ?? []).filter((c) => c.id && c.title && c.image && c.copy).map((c) => ({ ...c, themes: c.themes ?? [], companies: (c.companies ?? []).filter((item) => item.name && item.href && item.logo) }));
  return { ...backingDefaults, ...Object.fromEntries(Object.entries(data).filter(([, value]) => value != null)) } as BackingSection;
}
