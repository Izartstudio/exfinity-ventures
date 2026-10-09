import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { PreFooter } from "@/components/sections/pre-footer";
import { TeamProfile } from "@/components/sections/team-profile";
import { teamDirectoryContent, teamMemberSlug } from "@/content/team";
import { siteName, siteUrl } from "@/lib/seo";

const teamMembers = Array.from(new Map([...teamDirectoryContent.partners, ...teamDirectoryContent.founders, ...teamDirectoryContent.investmentTeam, ...teamDirectoryContent.tacTeam].map((member) => [teamMemberSlug(member.name), member])).entries());

export function generateStaticParams() { return teamMembers.map(([name]) => ({ name })); }

export async function generateMetadata({ params }: PageProps<"/team/[name]">): Promise<Metadata> {
  const { name } = await params;
  const member = teamMembers.find(([slug]) => slug === name)?.[1];
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
  const member = teamMembers.find(([slug]) => slug === name)?.[1];
  if (!member) notFound();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    image: `${siteUrl}${member.profileImage ?? member.image}`,
    url: `${siteUrl}/team/${name}`,
    worksFor: { "@type": "Organization", name: siteName, url: siteUrl },
    ...(member.linkedinUrl ? { sameAs: [member.linkedinUrl] } : {}),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} /><main><TeamProfile member={member} /><PreFooter /></main><Footer /></>;
}
