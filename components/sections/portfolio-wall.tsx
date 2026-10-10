"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { fallbackPortfolioWall, type PortfolioCompany, type PortfolioWallData } from "@/content/portfolio";

type FilterKey = "sector" | "status";
type PortfolioTheme = "DeepTech" | "AI Native Software" | "B2B Platforms";

const portfolioThemes: PortfolioTheme[] = ["DeepTech", "AI Native Software", "B2B Platforms"];
function getPortfolioTheme(company: PortfolioCompany): PortfolioTheme {
  const sector = company.sector.toLowerCase();
  if (/deep|robot|semiconductor|battery|ev tech|aerospace|material|manufactur|energy|climate|defence|life science/.test(sector)) return "DeepTech";
  if (/ai|saas|cyber|marketing tech|ops|generative|machine learning/.test(sector)) return "AI Native Software";
  return "B2B Platforms";
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const choose = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };
  const allLabel = label === "Status" ? "All status" : `All ${label.toLowerCase()}s`;
  const displayValue = value || allLabel;

  return <div className={`portfolio-filter${open ? " is-open" : ""}`} ref={filterRef}>
    <button type="button" className="portfolio-filter-trigger" aria-label={`${label}: ${displayValue}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      <span>{displayValue}</span><i aria-hidden="true" />
    </button>
    <div className="portfolio-filter-menu" role="listbox" aria-label={`Filter by ${label}`}>
      <button type="button" role="option" aria-selected={!value} className={!value ? "is-selected" : undefined} onClick={() => choose("")}>{allLabel}</button>
      {options.map((option) => <button type="button" role="option" aria-selected={value === option} className={value === option ? "is-selected" : undefined} onClick={() => choose(option)} key={option}>{option}</button>)}
    </div>
  </div>;
}

function CompanyCard({ company }: { company: PortfolioCompany }) {
  const content = <>
    <div className="portfolio-card-top">
      <span className={`portfolio-status is-${company.status.toLowerCase().replaceAll(" ", "-")}`}>{company.status}</span>
    </div>
    <div className="portfolio-company-logo">
      {company.logo ? <>
        <Image className={company.logoWhite ? "portfolio-company-logo-color" : undefined} src={company.logo} alt={company.name} width={260} height={120} sizes="(max-width: 650px) 42vw, (max-width: 1000px) 28vw, 20vw" quality={90} />
        {company.logoWhite && <Image className="portfolio-company-logo-white" src={company.logoWhite} alt="" width={260} height={120} sizes="(max-width: 650px) 42vw, (max-width: 1000px) 28vw, 20vw" quality={90} />}
      </> : <span>{company.name}</span>}
    </div>
    <p>{company.theme || company.sector}</p>
  </>;

  return <Link className="portfolio-company-card" href={`/portfolio/${company.id}`} aria-label={`View ${company.name}`}>{content}</Link>;
}

export function PortfolioWall({ data = fallbackPortfolioWall }: { data?: PortfolioWallData }) {
  const { companies, sectionLabel } = data;
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ sector: "", status: "" });
  const options = useMemo(() => ({
    sector: portfolioThemes,
    status: ["Active", "Exited"],
  }), []);
  const filtered = companies.filter((company) =>
    (!filters.sector || getPortfolioTheme(company) === filters.sector) &&
    (!filters.status || company.status === filters.status),
  );
  const update = (key: FilterKey) => (value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return <section className="portfolio-section" aria-labelledby="portfolio-wall-title">
    <div className="container">
      <div className="portfolio-heading"><span /><h2 id="portfolio-wall-title">{sectionLabel}</h2></div>
      <div className="portfolio-filters">
        <FilterSelect label="Sector" value={filters.sector} options={options.sector} onChange={update("sector")} />
        <FilterSelect label="Status" value={filters.status} options={options.status} onChange={update("status")} />
      </div>
      {filtered.length ? <div className="portfolio-company-grid">{filtered.map((company) => <CompanyCard company={company} key={company.id} />)}</div> : <div className="portfolio-empty"><p>No companies match these filters.</p><button type="button" onClick={() => setFilters({ sector: "", status: "" })}>Clear filters</button></div>}
    </div>
  </section>;
}
