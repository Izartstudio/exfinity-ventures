import { fallbackPortfolioWall, type PortfolioCompany, type PortfolioWallData } from "@/content/portfolio";
import { getPublishedSection } from "./sections";

async function fetchPortfolioWall(): Promise<PortfolioWallData> {
  const data = await getPublishedSection<PortfolioWallData>("portfolioPage", `sectionLabel,
    companies[]{name,"id":slug.current,hideFromPortfolio,"logo":logo.asset->url,
      "logoWhite":logoWhite.asset->url,fund,additionalFunds,sector,theme,inceptionYear,status,
      tagline,description,partneredSince,entryStage,founders,exfinityTeam,linkedinUrl,websiteUrl}`);
  if (!data) return fallbackPortfolioWall;
  // Published collections are authoritative, including intentionally empty ones.
  return {
    sectionLabel: data.sectionLabel ?? fallbackPortfolioWall.sectionLabel,
    companies: (data.companies ?? []).filter((company) => company.name && company.id && company.sector && company.status),
  };
}

export async function getPortfolioWall(): Promise<PortfolioWallData> {
  const portfolio = await fetchPortfolioWall();
  return { ...portfolio, companies: portfolio.companies.filter((company) => !company.hideFromPortfolio) };
}

// Hidden portfolio entries retain their direct pages, as described in Studio.
export async function getPortfolioCompany(slug: string): Promise<PortfolioCompany | undefined> {
  return (await fetchPortfolioWall()).companies.find((company) => company.id === slug);
}
