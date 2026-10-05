import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { PortfolioWall } from "@/components/sections/portfolio-wall";
import { PreFooter } from "@/components/sections/pre-footer";
import { TeamHero } from "@/components/sections/team-hero";
import { getPortfolioWall } from "@/lib/sanity/portfolio";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Portfolio",
  description: "Explore the DeepTech, AI-native software and B2B platform companies backed by Exfinity Venture Partners.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const portfolio = await getPortfolioWall();

  return <>
    <main>
      <TeamHero title={<>Backing the<br />Technologies of tomorrow</>} />
      <PortfolioWall data={portfolio} />
      <PreFooter />
    </main>
    <Footer />
  </>;
}
