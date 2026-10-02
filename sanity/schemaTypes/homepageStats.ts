export const homepageStats = {
  name: "homepageStats",
  title: "Homepage Statistics",
  type: "document",
  fields: [
    {
      name: "stats",
      title: "Statistics",
      type: "array",
      validation: (Rule: { required(): unknown }) => Rule.required(),
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            { name: "value", title: "Value", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    },
  ],
};
