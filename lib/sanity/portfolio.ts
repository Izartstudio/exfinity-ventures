import { fallbackPortfolioWall, updatedPortfolioLogos, type PortfolioCompany, type PortfolioWallData } from "@/content/portfolio";

type SanityPortfolioCompany = Omit<PortfolioCompany, "id"> & { id?: string };
type SanityPortfolioResponse = {
  result?: {
    sectionLabel?: string;
    companies?: SanityPortfolioCompany[];
  };
};

export async function getPortfolioWall(): Promise<PortfolioWallData> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return fallbackPortfolioWall;

  const query = encodeURIComponent(`*[_type == "portfolioPage"][0]{
    sectionLabel,
    "companies": companies[]{
      "id": coalesce(slug.current, _key),
      name,
      "logo": logo.asset->url,
      fund,
      sector,
      status,
      href
    }
  }`);
  const url = `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return fallbackPortfolioWall;
    const data = (await response.json()) as SanityPortfolioResponse;
    const companies = data.result?.companies
      ?.filter((company) => company.name && company.fund && company.sector && company.status)
      .map((company, index) => {
        const id = company.id || `portfolio-company-${index}`;
        return { ...company, id, logo: updatedPortfolioLogos[id] || company.logo };
      }) as PortfolioCompany[] | undefined;

    if (!companies?.length) return fallbackPortfolioWall;
    return {
      sectionLabel: data.result?.sectionLabel || fallbackPortfolioWall.sectionLabel,
      companies,
    };
  } catch {
    return fallbackPortfolioWall;
  }
}

export async function getPortfolioCompany(slug: string): Promise<PortfolioCompany | undefined> {
  const fallback = fallbackPortfolioWall.companies.find((company) => company.id === slug);
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return fallback;

  const query = encodeURIComponent(`*[_type == "portfolioPage"][0].companies[slug.current == $slug][0]{
    "id": slug.current,
    name,
    "logo": logo.asset->url,
    fund,
    sector,
    status,
    tagline,
    description,
    partneredSince,
    entryStage,
    founders,
    exfinityTeam,
    linkedinUrl,
    websiteUrl
  }`);
  const url = `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}&$slug=${encodeURIComponent(JSON.stringify(slug))}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return fallback;
    const data = (await response.json()) as { result?: PortfolioCompany };
    return data.result?.name ? { ...data.result, logo: updatedPortfolioLogos[slug] || data.result.logo } : fallback;
  } catch {
    return fallback;
  }
}
