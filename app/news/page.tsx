import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { NewsLedger } from "@/components/sections/news-ledger";
import { PreFooter } from "@/components/sections/pre-footer";
import { TeamHero } from "@/components/sections/team-hero";
import { createMetadata } from "@/lib/seo";
import { getNewsArticles } from "@/lib/sanity/news";

export const metadata: Metadata = createMetadata({
  title: "News & Insights",
  description: "Read the latest Exfinity Venture Partners news, research, portfolio updates and perspectives on DeepTech and AI.",
  path: "/news",
});

export default async function NewsPage() {
  const articles = await getNewsArticles();
  const items = articles.map(({ id, title, image, date, category, slug }) => ({ id, title, image, date, category, slug }));
  return <>
    <main>
      <TeamHero title="Stay Informed With News & Insights" />
      <NewsLedger items={items} />
      <PreFooter />
    </main>
    <Footer />
  </>;
}
