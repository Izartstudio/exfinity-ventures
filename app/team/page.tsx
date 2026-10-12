import type { Metadata } from "next";
import { TeamHero } from "@/components/sections/team-hero";
import { TeamDirectory, type TeamTab } from "@/components/sections/team-directory";
import { Offices } from "@/components/sections/offices";
import { PreFooter } from "@/components/sections/pre-footer";
import { Footer } from "@/components/layout/footer";
import { createMetadata } from "@/lib/seo";
import { getTeamPage } from "@/lib/sanity/team";

export const metadata: Metadata = createMetadata({
  title: "Team",
  description: "Meet Exfinity Venture Partners' operator-led investment team, partners, founders and advisors.",
  path: "/team",
});

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) {
  const tabParam = (await searchParams).tab;
  const initialTab: TeamTab = tabParam === "tac" || tabParam === "founders" ? tabParam : "partners";
  const content = await getTeamPage();
  const heroTitle = <>{(content.heroTitleLines ?? []).map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</>;

  return <>
    <main>
      <TeamHero title={heroTitle} />
      <TeamDirectory content={content} initialTab={initialTab} />
      <Offices label={content.officesLabel} title={content.officesTitle} offices={content.offices} />
      <PreFooter />
    </main>
    <Footer />
  </>;
}
