import { teamDirectoryContent, teamMemberSlug, type TeamDirectoryContent, type TeamMember, type TeamOffice } from "@/content/team";

type TeamPageResponse = { result?: TeamDirectoryContent };

const defaultOffices: TeamOffice[] = [
  { city: "Bangalore", country: "India", image: "/team/offices/bangalore.jpg" },
  { city: "Singapore City", country: "Singapore", image: "/team/offices/singapore.jpg" },
  { city: "Silicon Valley", country: "USA", image: "/team/offices/silicon-valley-enhanced.png" },
];

const groups = ["partners", "founders", "investmentTeam", "tacTeam"] as const;

function fallbackTeamPage(): TeamDirectoryContent {
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
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const fallback = fallbackTeamPage();
  if (!projectId || !dataset) return fallback;

  const memberProjection = `{
    name, "slug": slug.current, role, region, funds, hideFromTeamPage,
    "image": image.asset->url, "profileImage": profileImage.asset->url,
    imagePosition, biography, portfolioCompanyIds, linkedinUrl
  }`;
  const query = `*[_type == "teamPage" && !(_id in path("drafts.**"))][0]{
    heroTitleLines, sectionLabel, partnersTitle, foundersTitle, investmentTitle, tacTitle,
    "partners": partners[]${memberProjection},
    "founders": founders[]${memberProjection},
    "investmentTeam": investmentTeam[]${memberProjection},
    "tacTeam": tacTeam[]${memberProjection},
    officesLabel, officesTitle, profileCompaniesTitle, profileCompaniesDescription,
    "offices": offices[]{city,country,"image": image.asset->url,imagePosition}
  }`;
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallback;
    const data = (await response.json()) as TeamPageResponse;
    if (!data.result) return fallback;

    const result = { ...fallback, ...data.result };
    for (const group of groups) {
      if (!Array.isArray(data.result[group])) result[group] = fallback[group];
      result[group] = result[group].map((member) => {
        const original = fallback[group].find((fallbackMember) =>
          teamMemberSlug(fallbackMember.name) === teamMemberSlug(member.name)
        );
        return {
          ...member,
          hideFromTeamPage: member.hideFromTeamPage ?? original?.hideFromTeamPage ?? false,
        };
      });
    }
    result.partners = result.partners.map((member) => ({
      ...member,
      funds: member.funds ?? fallback.partners.find((original) =>
        teamMemberSlug(original.name) === teamMemberSlug(member.name)
      )?.funds,
    }));
    if (!Array.isArray(data.result.offices)) result.offices = fallback.offices;
    return result;
  } catch {
    return fallback;
  }
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
