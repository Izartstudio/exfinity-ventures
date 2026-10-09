import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { portfolioCompanies } from "@/content/portfolio";
import { siteUrl } from "@/lib/seo";
import { teamDirectoryContent, teamMemberSlug } from "@/content/team";

export default function sitemap(): MetadataRoute.Sitemap {
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
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioCompanies.map((company) => ({
    url: `${siteUrl}/portfolio/${company.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const teamMembers = Array.from(new Map([
    ...teamDirectoryContent.partners,
    ...teamDirectoryContent.investmentTeam,
    ...teamDirectoryContent.tacTeam,
    ...teamDirectoryContent.founders,
  ].map((member) => [teamMemberSlug(member.name), member])).keys());

  const teamRoutes: MetadataRoute.Sitemap = teamMembers.map((slug) => ({
    url: `${siteUrl}/team/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...portfolioRoutes, ...teamRoutes];
}
