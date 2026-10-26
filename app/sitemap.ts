import type { MetadataRoute } from "next";
import { getNewsArticles } from "@/lib/sanity/news";
import { getPortfolioWall } from "@/lib/sanity/portfolio";
import { getTeamPage } from "@/lib/sanity/team";
import { siteUrl } from "@/lib/seo";
import { teamMemberSlug } from "@/content/team";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, portfolio, team] = await Promise.all([
    getNewsArticles(),
    getPortfolioWall(),
    getTeamPage(),
  ]);
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/team`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/news`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/aif-registration-details`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}${article.slug}`,
    lastModified: new Date(article.updatedAt ?? article.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolio.companies.map((company) => ({
    url: `${siteUrl}/portfolio/${company.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const teamMembers = Array.from(new Map([
    ...team.partners,
    ...team.investmentTeam,
    ...team.tacTeam,
    ...team.founders,
  ].map((member) => [member.slug || teamMemberSlug(member.name), member])).keys());

  const teamRoutes: MetadataRoute.Sitemap = teamMembers.map((slug) => ({
    url: `${siteUrl}/team/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...portfolioRoutes, ...teamRoutes];
}
