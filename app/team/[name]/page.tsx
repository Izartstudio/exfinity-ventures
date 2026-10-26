import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { PreFooter } from "@/components/sections/pre-footer";
import { TeamProfile } from "@/components/sections/team-profile";
import { teamDirectoryContent, teamMemberSlug } from "@/content/team";
import { siteName, siteUrl } from "@/lib/seo";
import { getTeamMember, getTeamPage } from "@/lib/sanity/team";
import { getPortfolioWall } from "@/lib/sanity/portfolio";

const teamMembers = Array.from(new Map([...teamDirectoryContent.partners, ...teamDirectoryContent.founders, ...teamDirectoryContent.investmentTeam, ...teamDirectoryContent.tacTeam]
  .filter((member) => !member.hideFromTeamPage)
  .map((member) => [teamMemberSlug(member.name), member])).entries());

export function generateStaticParams() { return teamMembers.map(([name]) => ({ name })); }

export async function generateMetadata({ params }: PageProps<"/team/[name]">): Promise<Metadata> {
  const { name } = await params;
  const member = await getTeamMember(name);
  if (!member) return {};
  const description = `Meet ${member.name}, ${member.role} at ${siteName}.`;
  const image = member.profileImage ?? member.image;
  return {
    title: member.name,
    description,
    alternates: { canonical: `/team/${name}` },
    openGraph: {
      title: `${member.name} | ${siteName}`,
      description,
      url: `/team/${name}`,
      siteName,
      type: "profile",
      locale: "en_IN",
      images: [{ url: image, alt: member.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${member.name} | ${siteName}`,
      description,
      images: [image],
    },
  };
}

export default async function TeamProfilePage({ params }: PageProps<"/team/[name]">) {
  const { name } = await params;
  const [member, content, portfolio] = await Promise.all([getTeamMember(name), getTeamPage(), getPortfolioWall()]);
  if (!member) notFound();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    image: new URL(member.profileImage ?? member.image, siteUrl).href,
    url: `${siteUrl}/team/${name}`,
    worksFor: { "@type": "Organization", name: siteName, url: siteUrl },
    ...(member.linkedinUrl ? { sameAs: [member.linkedinUrl] } : {}),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} /><main><TeamProfile member={member} portfolioCompanies={portfolio.companies} showFunds={content.partners.some((partner) => (partner.slug || teamMemberSlug(partner.name)) === name)} companiesTitle={content.profileCompaniesTitle} companiesDescription={content.profileCompaniesDescription} /><PreFooter /></main><Footer /></>;
}
