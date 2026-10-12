import {
  fallbackPortfolioWall,
  type PortfolioCompany,
  type PortfolioFund,
  type PortfolioStatus,
  type PortfolioWallData,
} from "@/content/portfolio";

type SanityCompany = {
  name?: string;
  slug?: string;
  hideFromPortfolio?: boolean;
  logo?: string;
  fund?: string;
  sector?: string;
  status?: string;
  tagline?: string;
  description?: string;
  partneredSince?: string;
  entryStage?: string;
  founders?: string[];
  exfinityTeam?: string[];
  linkedinUrl?: string;
  websiteUrl?: string;
};

type PortfolioResponse = {
  result?: {
    sectionLabel?: string;
    companies?: SanityCompany[];
  };
};

async function fetchPortfolioWall(): Promise<PortfolioWallData> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return fallbackPortfolioWall;

  const query = `*[_type == "portfolioPage" && !(_id in path("drafts.**"))][0]{
    sectionLabel,
    "companies": companies[]{
      name, "slug": slug.current, hideFromPortfolio, "logo": logo.asset->url, fund, sector, status,
      tagline, description, partneredSince, entryStage, founders, exfinityTeam,
      linkedinUrl, websiteUrl
    }
  }`;
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallbackPortfolioWall;
    const data = (await response.json()) as PortfolioResponse;
    const source = data.result;
    if (!source?.companies?.length) return fallbackPortfolioWall;

    const companies = source.companies
      .filter((company) => company.name && company.slug && company.fund && company.sector && company.status)
      .map((company): PortfolioCompany => {
        const fallback = fallbackPortfolioWall.companies.find((item) => item.id === company.slug);
        return {
          ...fallback,
          id: company.slug!,
          name: company.name!,
          hideFromPortfolio: company.hideFromPortfolio ?? fallback?.hideFromPortfolio ?? false,
          fund: company.fund as PortfolioFund,
          sector: company.slug === "locus" || company.slug === "practically"
            ? "AI Native Software"
            : company.sector!,
          status: company.status as PortfolioStatus,
          logo: company.logo ?? fallback?.logo,
          logoWhite: fallback?.logoWhite,
          tagline: company.tagline,
          description: company.description,
          partneredSince: company.partneredSince,
          entryStage: company.entryStage,
          founders: company.founders,
          exfinityTeam: company.exfinityTeam,
          linkedinUrl: company.linkedinUrl,
          websiteUrl: company.websiteUrl,
        };
      });

    return companies.length
      ? { sectionLabel: source.sectionLabel || fallbackPortfolioWall.sectionLabel, companies }
      : fallbackPortfolioWall;
  } catch {
    return fallbackPortfolioWall;
  }
}

export async function getPortfolioWall(): Promise<PortfolioWallData> {
  const portfolio = await fetchPortfolioWall();
  return {
    ...portfolio,
    companies: portfolio.companies.filter((company) => !company.hideFromPortfolio),
  };
}

export async function getPortfolioCompany(slug: string): Promise<PortfolioCompany | undefined> {
  return (await fetchPortfolioWall()).companies.find((company) => company.id === slug);
}
