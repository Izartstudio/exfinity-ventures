const required = (rule: { required: () => unknown }) => rule.required();

export const portfolioPage = {
  name: "portfolioPage",
  title: "Portfolio Page",
  type: "document",
  fields: [
    {
      name: "sectionLabel",
      title: "Section label",
      type: "string",
      initialValue: "Our Portfolio",
      validation: required,
    },
    {
      name: "companies",
      title: "Portfolio companies",
      description: "Fund, sector and status filters are generated automatically from the values entered on these cards.",
      type: "array",
      validation: required,
      of: [
        {
          name: "portfolioCompany",
          title: "Portfolio company",
          type: "object",
          fields: [
            { name: "name", title: "Company name", type: "string", validation: required },
            { name: "slug", title: "Company page slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: required },
            {
              name: "logo",
              title: "Company logo",
              type: "image",
              options: { hotspot: false },
              fields: [{ name: "alt", title: "Alternative text", type: "string" }],
            },
            {
              name: "fund",
              title: "Fund",
              description: "For example: Fund I, Fund II or Fund III. A new value automatically becomes a filter option.",
              type: "string",
              validation: required,
            },
            {
              name: "sector",
              title: "Sector / industry",
              description: "Enter an existing sector consistently or add a new one. New sectors automatically appear in the filter.",
              type: "string",
              validation: required,
            },
            {
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Active", value: "Active" },
                  { title: "Exited", value: "Exited" },
                ],
                layout: "radio",
              },
              initialValue: "Active",
              validation: required,
            },
            { name: "tagline", title: "Tagline", type: "string" },
            { name: "description", title: "Company description", type: "text", rows: 5 },
            { name: "partneredSince", title: "Partnered since", type: "string", description: "For example: 2022" },
            { name: "entryStage", title: "Entry stage", type: "string", description: "For example: Seed" },
            { name: "founders", title: "Founders", type: "array", of: [{ type: "string" }] },
            { name: "exfinityTeam", title: "Exfinity team", type: "array", of: [{ type: "string" }] },
            { name: "linkedinUrl", title: "LinkedIn URL", type: "url" },
            { name: "websiteUrl", title: "Website URL", type: "url" },
          ],
          preview: {
            select: { title: "name", subtitle: "sector", media: "logo" },
          },
        },
      ],
    },
  ],
  preview: {
    prepare: () => ({ title: "Portfolio Page" }),
  },
};
