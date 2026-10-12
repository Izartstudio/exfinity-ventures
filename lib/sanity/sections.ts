import { backingDefaults, companiesDefaults, type BackingSection, type CompaniesSection } from "@/content/homepage-sections";

export async function getPublishedSection<T>(type: string, projection: string): Promise<T | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  const query = encodeURIComponent(`*[_type == "${type}" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{${projection}}`);
  try {
    const response = await fetch(`https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}&perspective=published`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    return data.result ?? null;
  } catch { return null; }
}

export async function getHomepageCompanies(): Promise<CompaniesSection> {
  const data = await getPublishedSection<CompaniesSection>("homepageCompanies", `heading,description,ctaLabel,ctaHref,companies[]{name,href,"logo":coalesce(logoImage.asset->url,logo),"width":coalesce(width,150),"height":coalesce(height,50)}`);
  if (!data?.companies?.length || !data.companies.every((c) => c.name && c.href && c.logo)) return companiesDefaults;
  return { ...companiesDefaults, ...Object.fromEntries(Object.entries(data).filter(([, value]) => value != null)) } as CompaniesSection;
}

export async function getHomepageBacking(): Promise<BackingSection> {
  const data = await getPublishedSection<BackingSection>("homepageBacking", `kicker,heading,description,ctaLabel,ctaHref,readMoreLabel,aboutLabel,themesLabel,cards[]{id,title,"image":coalesce(cardImage.asset->url,image),aboutLead,copy,themes,companies[]{name,href,"logo":coalesce(logoImage.asset->url,logo),"logoWhite":coalesce(whiteLogoImage.asset->url,logoWhite,logoImage.asset->url,logo)}}`);
  if (!data?.cards?.length || !data.cards.every((c) => c.id && c.title && c.image && c.copy && c.themes?.length && c.companies?.length && c.companies.every((item) => item.name && item.href && item.logo))) return backingDefaults;
  return { ...backingDefaults, ...Object.fromEntries(Object.entries(data).filter(([, value]) => value != null)) } as BackingSection;
}
