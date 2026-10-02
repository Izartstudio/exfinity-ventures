export const homepageFounders = {
  name: "homepageFounders",
  title: "Homepage Founders",
  type: "document",
  fields: [
    {
      name: "founders",
      title: "Founders",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string", validation: (rule: { required: () => unknown }) => rule.required() },
            { name: "role", title: "Role", type: "string", validation: (rule: { required: () => unknown }) => rule.required() },
            { name: "quote", title: "Quote", type: "text", rows: 4, validation: (rule: { required: () => unknown }) => rule.required() },
            { name: "image", title: "Portrait", type: "image", options: { hotspot: true }, validation: (rule: { required: () => unknown }) => rule.required() },
          ],
          preview: { select: { title: "name", subtitle: "role", media: "image" } },
        },
      ],
    },
  ],
};
