import type { Metadata } from "next";
import { TeamHero } from "@/components/sections/team-hero";
import { TeamDirectory } from "@/components/sections/team-directory";
import { Offices } from "@/components/sections/offices";
import { PreFooter } from "@/components/sections/pre-footer";
import { Footer } from "@/components/layout/footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Team",
  description: "Meet Exfinity Venture Partners' operator-led investment team, partners, founders and advisors.",
  path: "/team",
});

export default function TeamPage() {
  return <>
    <main>
      <TeamHero />
      <TeamDirectory />
      <Offices />
      <PreFooter />
    </main>
    <Footer />
  </>;
}
