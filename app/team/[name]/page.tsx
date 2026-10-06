import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { PreFooter } from "@/components/sections/pre-footer";
import { TeamProfile } from "@/components/sections/team-profile";
import { teamDirectoryContent, teamMemberSlug } from "@/content/team";
import { siteName } from "@/lib/seo";

const teamMembers = Array.from(new Map([...teamDirectoryContent.partners, ...teamDirectoryContent.founders, ...teamDirectoryContent.investmentTeam, ...teamDirectoryContent.tacTeam].map((member) => [teamMemberSlug(member.name), member])).entries());

export function generateStaticParams() { return teamMembers.map(([name]) => ({ name })); }

export async function generateMetadata({ params }: PageProps<"/team/[name]">): Promise<Metadata> {
  const { name } = await params;
  const member = teamMembers.find(([slug]) => slug === name)?.[1];
  if (!member) return {};
  const description = `Meet ${member.name}, ${member.role} at ${siteName}.`;
  return { title: member.name, description, alternates: { canonical: `/team/${name}` } };
}

export default async function TeamProfilePage({ params }: PageProps<"/team/[name]">) {
  const { name } = await params;
  const member = teamMembers.find(([slug]) => slug === name)?.[1];
  if (!member) notFound();
  return <><main><TeamProfile member={member} /><PreFooter /></main><Footer /></>;
}
