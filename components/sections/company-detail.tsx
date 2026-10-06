import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PortfolioCompany } from "@/content/portfolio";

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return <div className="company-detail-row"><dt>{label}</dt><dd>{children}</dd></div>;
}

export function CompanyDetail({ company }: { company: PortfolioCompany }) {
  return <section className="company-detail" aria-labelledby="company-detail-title">
    <div className="company-detail-layout">
      <div className="company-detail-visual">
        <Link className="company-back" href="/portfolio"><span aria-hidden="true">‹</span> Back to portfolio</Link>
        <div className="company-detail-visual-logo">
          {company.logo ? <Image src={company.logoWhite ?? company.logo} alt={company.name} width={320} height={150} unoptimized /> : <span>{company.name}</span>}
        </div>
      </div>
      <div className="company-detail-copy">
        <div className="company-detail-title-row">
          <div>
            <h1 id="company-detail-title">{company.name}</h1>
            {company.tagline && <h2>{company.tagline}</h2>}
          </div>
          <div className="company-detail-socials">
            {company.linkedinUrl && <a href={company.linkedinUrl} target="_blank" rel="noreferrer" aria-label={`${company.name} on LinkedIn`}><Image src="/icons/company-linkedin.svg" alt="" width={24} height={24} /></a>}
            {company.websiteUrl && <a href={company.websiteUrl} target="_blank" rel="noreferrer" aria-label={`${company.name} website`}><Image src="/icons/company-web.svg" alt="" width={24} height={24} /></a>}
          </div>
        </div>
        
        {company.description && <p className="company-description">{company.description}</p>}
        <div className="company-facts-shell">
          <dl className="company-facts">
            <DetailRow label="Partnered since"><div className="company-pills">{company.partneredSince && <span>{company.partneredSince}</span>}{company.entryStage && <span>{company.entryStage}</span>}</div></DetailRow>
            <DetailRow label="Fund">{[company.fund, ...(company.additionalFunds || [])].map((fund) => fund.replace("Fund IV", "Fund 4").replace("Fund III", "Fund 3").replace("Fund II", "Fund 2").replace("Fund I", "Fund 1")).join(", ")}</DetailRow>
            <DetailRow label="Theme">{company.theme || company.sector}</DetailRow>
            {company.theme && <DetailRow label="Sector">{company.sector}</DetailRow>}
            <DetailRow label="Company status"><span className="company-status-pill">{company.status}</span></DetailRow>
            {!!company.founders?.length && <DetailRow label="Founders"><span className="company-name-list">{company.founders.join("\n")}</span></DetailRow>}
            {!!company.exfinityTeam?.length && <DetailRow label="Exfinity team"><span className="company-name-list">{company.exfinityTeam.join("\n")}</span></DetailRow>}
          </dl>
        </div>
      </div>
    </div>
  </section>;
}
