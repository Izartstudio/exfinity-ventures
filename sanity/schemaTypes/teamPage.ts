const required = (rule: { required: () => unknown }) => rule.required();

const teamMember = {
  type: "object",
  name: "teamMember",
  fields: [
    { name: "name", title: "Name", type: "string", validation: required },
    { name: "slug", title: "Profile page slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: required },
    { name: "role", title: "Role", type: "string", validation: required },
    { name: "region", title: "Region", type: "string", validation: required },
    {
      name: "hideFromTeamPage",
      title: "Hide from this team tab",
      description: "Turn on to remove this member from the team-page tab. Their direct profile remains available.",
      type: "boolean",
      initialValue: false,
    },
    { name: "image", title: "Directory image", type: "image", options: { hotspot: true }, validation: required },
    { name: "profileImage", title: "Profile image override", type: "image", options: { hotspot: true } },
    {
      name: "imagePosition",
      title: "Image position",
      description: "Optional CSS position, for example: center top or 50% 30%.",
      type: "string",
    },
    { name: "biography", title: "Biography", type: "array", of: [{ type: "text", rows: 5 }] },
    {
      name: "portfolioCompanyIds",
      title: "Portfolio company slugs",
      description: "Add the company page slugs to show on this member's profile.",
      type: "array",
      of: [{ type: "string" }],
    },
    { name: "linkedinUrl", title: "LinkedIn URL", type: "url" },
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
};

const memberGroup = (name: string, title: string) => ({
  name,
  title,
  description: "Drag members to rearrange their order. Open any member to hide or unhide them in this tab.",
  type: "array",
  of: [{
    ...teamMember,
    fields: name === "partners" ? [
      ...teamMember.fields,
      { name: "funds", title: "Funds", type: "string", description: "Fund numbers, for example I, II, III, IV. Displayed only inside Partners & IC profile pages." },
    ] : teamMember.fields,
  }],
});

export const teamPage = {
  name: "teamPage",
  title: "Team Page",
  type: "document",
  fields: [
    {
      name: "heroTitleLines",
      title: "Hero title lines",
      description: "Each item is displayed on a separate line.",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Experience that", "Goes Beyond Capital"],
      validation: required,
    },
    { name: "sectionLabel", title: "Team section label", type: "string", initialValue: "The Team", validation: required },
    { name: "partnersTitle", title: "Partners section title", type: "string", initialValue: "Partners & IC", validation: required },
    { name: "foundersTitle", title: "Founders section title", type: "string", initialValue: "Founding Sponsors", validation: required },
    { name: "investmentTitle", title: "Investment team section title", type: "string", initialValue: "Team", validation: required },
    { name: "tacTitle", title: "Technical advisory section title", type: "string", initialValue: "Technical Advisory Committee", validation: required },
    memberGroup("partners", "Partners & IC"),
    memberGroup("founders", "Founding Sponsors"),
    memberGroup("investmentTeam", "Investment Team"),
    memberGroup("tacTeam", "Technical Advisory Committee"),
    {
      name: "officesLabel",
      title: "Offices section label",
      type: "string",
      initialValue: "Offices",
      validation: required,
    },
    {
      name: "officesTitle",
      title: "Offices section heading",
      type: "string",
      initialValue: "We stay close to the markets our founders build for",
      validation: required,
    },
    {
      name: "offices",
      title: "Offices",
      description: "Drag offices to rearrange their order on the website.",
      type: "array",
      of: [{
        type: "object",
        name: "office",
        fields: [
          { name: "city", title: "City", type: "string", validation: required },
          { name: "country", title: "Country", type: "string", validation: required },
          { name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: required },
          { name: "imagePosition", title: "Image position", type: "string", description: "Optional CSS position, for example: center top." },
        ],
        preview: { select: { title: "city", subtitle: "country", media: "image" } },
      }],
    },
    { name: "profileCompaniesTitle", title: "Profile companies heading", type: "string", initialValue: "Companies", validation: required },
    {
      name: "profileCompaniesDescription",
      title: "Profile companies description",
      type: "text",
      rows: 3,
      initialValue: "A selection of companies they work closely with, bringing investment experience, strategic guidance and operational perspective to their growth",
      validation: required,
    },
  ],
  preview: { prepare: () => ({ title: "Team Page" }) },
};
