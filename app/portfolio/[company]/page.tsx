import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyDetail } from "@/components/sections/company-detail";
import { Footer } from "@/components/layout/footer";
import { PreFooter } from "@/components/sections/pre-footer";
import { portfolioCompanies } from "@/content/portfolio";
import { getPortfolioCompany } from "@/lib/sanity/portfolio";
import { siteName, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return portfolioCompanies.map((company) => ({ company: company.id }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[company]">): Promise<Metadata> {
  const { company: slug } = await params;
  const company = await getPortfolioCompany(slug);
  if (!company) return {};

  const description = company.description || `${company.name} is a ${company.sector} portfolio company backed by ${siteName}.`;
  const path = `/portfolio/${company.id}`;

  return {
    title: company.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${company.name} | ${siteName}`,
      description,
      url: path,
      siteName,
      type: "website",
      locale: "en_IN",
      images: company.logo ? [{ url: company.logo, alt: company.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} | ${siteName}`,
      description,
      images: company.logo ? [company.logo] : undefined,
    },
  };
}

export default async function CompanyDetailPage({ params }: PageProps<"/portfolio/[company]">) {
  const { company: slug } = await params;
  const company = await getPortfolioCompany(slug);
  if (!company) notFound();

  const companyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description ?? company.tagline,
    url: company.websiteUrl ?? `${siteUrl}/portfolio/${company.id}`,
    mainEntityOfPage: `${siteUrl}/portfolio/${company.id}`,
    ...(company.logo ? { logo: `${siteUrl}${company.logo}` } : {}),
    ...(company.linkedinUrl ? { sameAs: [company.linkedinUrl] } : {}),
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }} />
    <main>
      <CompanyDetail company={company} />
      <PreFooter />
    </main>
    <Footer />
  </>;
}
