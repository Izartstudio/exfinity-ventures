const principles = [
  {
    number: "01",
    title: "Cheque Size",
    heading:
      "We invest $2–3M at entry",
    description:
      "Half of the investible corpus is reserved for follow ons",
  },
  {
    number: "02",
    title: "Lead",
    heading: "We Lead/Co-Lead early rounds with conviction",
    description:
      "We lead or co-lead Seed, Pre-Series A & Series A rounds, backing companies as their technology and market ambition take shape",
  },
  {
    number: "03",
    title: "Board Participation",
    heading: "We take board seat as we invest",
    description:
      "A Partner stays directly engaged, taking a board seat and working alongside the founding team",
  },
] as const;

export function HowWeInvest() {
  return <section className="how-we-invest" aria-labelledby="how-we-invest-title"><div className="how-we-invest-glow" aria-hidden="true" /><div className="container"><h2 id="how-we-invest-title">How We Invest</h2><div className="invest-grid">{principles.map((principle) => <article className="invest-principle" key={principle.number}><div className="principle-title"><h3>{principle.title}</h3><span>{principle.number}</span></div><div className="principle-copy"><strong>{principle.heading}</strong><p>{principle.description}</p></div></article>)}</div></div></section>;
}
