import { fallbackPortfolioWall, type PortfolioCompany, type PortfolioWallData } from "@/content/portfolio";

export async function getPortfolioWall(): Promise<PortfolioWallData> {
  return fallbackPortfolioWall;
}

export async function getPortfolioCompany(slug: string): Promise<PortfolioCompany | undefined> {
  return fallbackPortfolioWall.companies.find((company) => company.id === slug);
}
