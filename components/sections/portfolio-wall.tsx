"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { fallbackPortfolioWall, type PortfolioCompany, type PortfolioWallData } from "@/content/portfolio";

type FilterKey = "fund" | "sector" | "status";
type PortfolioTheme = "Deep Tech" | "AI Native" | "B2B";

const portfolioThemes: PortfolioTheme[] = ["Deep Tech", "AI Native", "B2B"];
const themeByCompanyId: Record<string, PortfolioTheme> = {
  ati: "Deep Tech",
  maieutic: "Deep Tech",
  chara: "Deep Tech",
  log9: "Deep Tech",
  "raga-ai": "AI Native",
  awiros: "AI Native",
  cloudsek: "AI Native",
  moengage: "AI Native",
  pixis: "AI Native",
  "neural-garage": "AI Native",
  eccentric: "AI Native",
  qritive: "B2B",
};

function getPortfolioTheme(company: PortfolioCompany): PortfolioTheme {
  if (themeByCompanyId[company.id]) return themeByCompanyId[company.id];

  const sector = company.sector.toLowerCase();
  if (/deep|robot|semiconductor|battery|ev tech|aerospace|material|manufactur|energy|climate|defence|life science/.test(sector)) return "Deep Tech";
  if (/ai|saas|cyber|marketing tech|ops|generative|machine learning/.test(sector)) return "AI Native";
  return "B2B";
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="portfolio-filter">
    <span className="sr-only">Filter by {label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{label}</option>
      {options.map((option) => <option value={option} key={option}>{option}</option>)}
    </select>
  </label>;
}

function CompanyCard({ company }: { company: PortfolioCompany }) {
  const content = <>
    <div className="portfolio-card-top">
      <span className={`portfolio-status is-${company.status.toLowerCase()}`}>{company.status}</span>
      <span className="portfolio-fund">{company.fund}</span>
    </div>
    <div className="portfolio-company-logo">
      {company.logo ? <Image src={company.logo} alt={company.name} width={260} height={120} sizes="(max-width: 650px) 42vw, (max-width: 1000px) 28vw, 20vw" unoptimized /> : <span>{company.name}</span>}
    </div>
    <p>{company.sector}</p>
  </>;

  return <Link className="portfolio-company-card" href={`/portfolio/${company.id}`} aria-label={`View ${company.name}`}>{content}</Link>;
}

export function PortfolioWall({ data = fallbackPortfolioWall }: { data?: PortfolioWallData }) {
  const { companies, sectionLabel } = data;
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ fund: "", sector: "", status: "" });
  const options = useMemo(() => ({
    fund: [...new Set(companies.map((company) => company.fund))],
    sector: portfolioThemes,
    status: [...new Set(companies.map((company) => company.status))],
  }), [companies]);
  const filtered = companies.filter((company) =>
    (!filters.fund || company.fund === filters.fund) &&
    (!filters.sector || getPortfolioTheme(company) === filters.sector) &&
    (!filters.status || company.status === filters.status),
  );
  const update = (key: FilterKey) => (value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return <section className="portfolio-section" aria-labelledby="portfolio-wall-title">
    <div className="container">
      <div className="portfolio-heading"><span /><h2 id="portfolio-wall-title">{sectionLabel}</h2></div>
      <div className="portfolio-filters">
        <FilterSelect label="Fund" value={filters.fund} options={options.fund} onChange={update("fund")} />
        <FilterSelect label="Sector" value={filters.sector} options={options.sector} onChange={update("sector")} />
        <FilterSelect label="Status" value={filters.status} options={options.status} onChange={update("status")} />
      </div>
      {filtered.length ? <div className="portfolio-company-grid">{filtered.map((company) => <CompanyCard company={company} key={company.id} />)}</div> : <div className="portfolio-empty"><p>No companies match these filters.</p><button type="button" onClick={() => setFilters({ fund: "", sector: "", status: "" })}>Clear filters</button></div>}
    </div>
  </section>;
}
