import { Hero } from "@/components/sections/hero";
import { WhatWeBack } from "@/components/sections/what-we-back";
import { Stats } from "@/components/sections/stats";
import { HowWeInvest } from "@/components/sections/how-we-invest";
import { InvestmentPhilosophy } from "@/components/sections/investment-philosophy";
import { CompaniesWeBack } from "@/components/sections/companies-we-back";
import { OurFounders } from "@/components/sections/our-founders";
import { getHomepageFounders } from "@/lib/sanity/homepage";
import { Insights } from "@/components/sections/insights";
import { PreFooter } from "@/components/sections/pre-footer";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export default async function Home() {
  const founders = await getHomepageFounders();
  return <><ScrollReveal /><main><Hero /><WhatWeBack /><Stats /><InvestmentPhilosophy /><HowWeInvest /><CompaniesWeBack /><OurFounders founders={founders} /><Insights /><PreFooter /></main><Footer /></>;
}
