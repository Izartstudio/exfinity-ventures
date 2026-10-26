import { fallbackPortfolioWall } from "../content/portfolio";
import { fallbackFounders } from "../content/homepage-founders";
import { companiesDefaults, backingDefaults } from "../content/homepage-sections";
import { teamDirectoryContent } from "../content/team";
import faqs from "../content/contact-faqs.json";

const origin = process.env.CMS_AUDIT_ORIGIN || "https://exfinity-ventures.vercel.app";
const normalize = (text: string) => text.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\\n/g, " ").replace(/\s+/g, " ");
const checks: Record<string, string[]> = {
  "/": [companiesDefaults.heading, companiesDefaults.description, backingDefaults.heading, ...fallbackFounders.map((f) => f.name)],
  "/portfolio": fallbackPortfolioWall.companies.filter((c) => !c.hideFromPortfolio).map((c) => c.name),
  "/team": [...teamDirectoryContent.partners, ...teamDirectoryContent.investmentTeam].filter((m) => !m.hideFromTeamPage).map((m) => m.name),
  "/team?tab=tac": teamDirectoryContent.tacTeam.filter((m) => !m.hideFromTeamPage).map((m) => m.name),
  "/team?tab=founders": teamDirectoryContent.founders.filter((m) => !m.hideFromTeamPage).map((m) => m.name),
  "/contact": faqs.faqs.map((f) => f.question),
};
let failures = 0;
for (const [path, values] of Object.entries(checks)) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30000), cache: "no-store" });
  const html = normalize(await response.text());
  const missing = values.filter((value) => !html.includes(normalize(value)));
  failures += missing.length + (response.ok ? 0 : 1);
  console.log(JSON.stringify({ path, status: response.status, checked: values.length, missing }));
}
if (failures) process.exitCode = 1;
