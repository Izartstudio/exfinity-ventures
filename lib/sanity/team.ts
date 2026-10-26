import { teamDirectoryContent, teamMemberSlug, type TeamDirectoryContent, type TeamMember, type TeamOffice } from "@/content/team";

import { getPublishedSection } from "./sections";

const defaultOffices: TeamOffice[] = [
  { city: "Bangalore", country: "India", image: "/team/offices/bangalore.jpg" },
  { city: "Singapore City", country: "Singapore", image: "/team/offices/singapore.jpg" },
  { city: "Silicon Valley", country: "USA", image: "/team/offices/silicon-valley-enhanced.png" },
];

const groups = ["partners", "founders", "investmentTeam", "tacTeam"] as const;

export function fallbackTeamPage(): TeamDirectoryContent {
  return {
    ...teamDirectoryContent,
    heroTitleLines: ["Experience that", "Goes Beyond Capital"],
    sectionLabel: "The Team",
    officesLabel: "Offices",
    officesTitle: "We stay close to the markets our founders build for",
    offices: defaultOffices,
    profileCompaniesTitle: "Companies",
    profileCompaniesDescription: "A selection of companies they work closely with, bringing investment experience, strategic guidance and operational perspective to their growth",
  };
}

async function fetchTeamPage(): Promise<TeamDirectoryContent> {
  const fallback = fallbackTeamPage();

  const memberProjection = `{
    name, "slug": slug.current, role, region, funds, hideFromTeamPage,
    "image": image.asset->url, "profileImage": profileImage.asset->url,
    imagePosition, biography, portfolioCompanyIds, linkedinUrl
  }`;
  const projection = `
    heroTitleLines, sectionLabel, partnersTitle, foundersTitle, investmentTitle, tacTitle,
    "partners": partners[]${memberProjection},
    "founders": founders[]${memberProjection},
    "investmentTeam": investmentTeam[]${memberProjection},
    "tacTeam": tacTeam[]${memberProjection},
    officesLabel, officesTitle, profileCompaniesTitle, profileCompaniesDescription,
    "offices": offices[]{city,country,"image": image.asset->url,imagePosition}
  `;
  const data = await getPublishedSection<TeamDirectoryContent>("teamPage", projection);
  if (!data) return fallback;
  const result = { ...fallback, ...Object.fromEntries(Object.entries(data).filter(([, value]) => value != null)) } as TeamDirectoryContent;
  for (const group of groups) {
    result[group] = (data[group] ?? []).filter((member) => member.name && member.role && member.image);
  }
  result.offices = (data.offices ?? []).filter((office) => office.city && office.image);
  return result;
}

export async function getTeamPage(): Promise<TeamDirectoryContent> {
  const page = await fetchTeamPage();
  return {
    ...page,
    ...Object.fromEntries(groups.map((group) => [
      group,
      page[group].filter((member) => !member.hideFromTeamPage),
    ])),
  } as TeamDirectoryContent;
}

export async function getTeamMember(slug: string): Promise<TeamMember | undefined> {
  const page = await fetchTeamPage();
  return groups
    .flatMap((group) => page[group])
    .find((member) =>
      !member.hideFromTeamPage &&
      (member.slug || teamMemberSlug(member.name)) === slug
    );
}
