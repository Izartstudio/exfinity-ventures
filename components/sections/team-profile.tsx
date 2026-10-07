import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "@/content/team";
import { portfolioCompanies, type PortfolioCompany } from "@/content/portfolio";

function biographyFor(member: TeamMember) {
  if (member.biography?.length) return member.biography;
  return [
    `${member.name} is ${member.role.toLowerCase()} at Exfinity Venture Partners, working across ${member.region}.`,
    "At Exfinity, they work closely with founders, bringing investment experience, strategic guidance and an operator’s perspective to building category-defining technology companies.",
  ];
}

function companiesFor(member: TeamMember): PortfolioCompany[] {
  if (member.name === "Rajiv Kuchhal") {
    const ids = ["maieutic", "chara", "raga-ai", "awiros"];
    return ids.map((id) => portfolioCompanies.find((company) => company.id === id)).filter((company): company is PortfolioCompany => Boolean(company));
  }
  return portfolioCompanies.filter((company) => company.exfinityTeam?.includes(member.name)).slice(0, 4);
}

export function TeamProfile({ member }: { member: TeamMember }) {
  const companies = companiesFor(member);
  const funds = (member.funds ?? "III").split(",").map((fund) => fund.trim());

  return <>
    <section className="team-profile" aria-labelledby="team-profile-name">
      <div className="team-profile-layout">
        <div className="team-profile-copy">
          <h1 id="team-profile-name">{member.name}</h1>
          <div className="team-profile-role-row">
            <p>{member.role}</p>
            <a className="team-profile-linkedin" href="https://www.linkedin.com/company/exfinity-venture-partners" target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}>in</a>
          </div>
          <div className="team-profile-funds"><span>Fund</span><div>{funds.map((fund) => <b key={fund}>Fund {fund}</b>)}</div></div>
          <div className="team-profile-bio">{biographyFor(member).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
        <div className="team-profile-portrait"><Image src={member.image} alt={member.name} fill priority sizes="(max-width: 800px) 100vw, 50vw" style={{ objectPosition: member.imagePosition ?? "center center" }} /></div>
      </div>
    </section>

    <section className="team-profile-companies" aria-labelledby="team-companies-title">
      <div className="team-profile-companies-head">
        <p>A selection of companies they work closely with, bringing investment<br className="team-profile-desktop-break" /> experience, strategic guidance and operational perspective to their growth</p>
        <h2 id="team-companies-title">Companies</h2>
      </div>
      {companies.length ? <div className="team-profile-company-grid">{companies.map((company) => <Link href={`/portfolio/${company.id}`} className="team-profile-company-card" key={company.id}>
        <div className="team-profile-company-top"><span>{company.status}</span><b>{company.fund}</b></div>
        <div className="team-profile-company-logo">{company.logo ? <Image src={company.logo} alt={company.name} width={220} height={110} /> : <strong>{company.name}</strong>}</div>
        <p>{company.theme ?? company.sector} <i /> {company.sector}</p>
      </Link>)}</div> : <p className="team-profile-no-companies">Portfolio associations will be added soon.</p>}
    </section>
  </>;
}
