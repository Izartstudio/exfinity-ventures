const required = (rule: { required: () => unknown }) => rule.required();

export const blogPost = {
  name: "blogPost",
  title: "Blog Posts",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: required },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: required,
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "News", value: "News" },
          { title: "Social", value: "Social" },
          { title: "Newsletters", value: "Newsletters" },
        ],
        layout: "radio",
      },
      validation: required,
    },
    { name: "publishedAt", title: "Published date", type: "datetime", validation: required },
    {
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative text", type: "string" }],
      validation: required,
    },
    {
      name: "body",
      title: "Post content",
      type: "array",
      validation: required,
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Lead paragraph", value: "lead" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Strikethrough", value: "strike" },
              { title: "Highlight", value: "highlight" },
              { title: "Inline code", value: "code" },
              { title: "Superscript", value: "sup" },
              { title: "Subscript", value: "sub" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  { name: "href", title: "URL", type: "url" },
                  { name: "openInNewTab", title: "Open in a new tab", type: "boolean", initialValue: false },
                ],
              },
            ],
          },
        },
        {
          name: "postImage",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alternative text", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
        {
          name: "callout",
          title: "Callout",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "tone", title: "Style", type: "string", options: { list: ["neutral", "blue"] }, initialValue: "neutral" },
            { name: "text", title: "Text", type: "text", rows: 4 },
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        },
        {
          name: "pullQuote",
          title: "Quote with attribution",
          type: "object",
          fields: [
            { name: "quote", title: "Quote", type: "text", rows: 4 },
            { name: "attribution", title: "Attribution", type: "string" },
          ],
          preview: { select: { title: "quote", subtitle: "attribution" } },
        },
        {
          name: "contentTable",
          title: "Table",
          type: "object",
          fields: [
            { name: "caption", title: "Caption", type: "string" },
            { name: "headers", title: "Column headings", type: "array", of: [{ type: "string" }] },
            {
              name: "rows",
              title: "Rows",
              type: "array",
              of: [{ type: "object", name: "tableRow", fields: [{ name: "cells", title: "Cells", type: "array", of: [{ type: "string" }] }] }],
            },
          ],
          preview: { select: { title: "caption" }, prepare: ({ title }: { title?: string }) => ({ title: title || "Table" }) },
        },
        {
          name: "codeBlock",
          title: "Code block",
          type: "object",
          fields: [
            { name: "language", title: "Language", type: "string" },
            { name: "code", title: "Code", type: "text", rows: 12 },
          ],
          preview: { select: { title: "language", subtitle: "code" } },
        },
        { name: "divider", title: "Divider", type: "object", fields: [{ name: "label", title: "Internal label", type: "string" }] },
      ],
    },
    { name: "sourceUrl", title: "Read more URL", type: "url" },
    {
      name: "relatedStories",
      title: "Related stories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
      validation: (rule: { max: (length: number) => unknown }) => rule.max(6),
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "heroImage" },
  },
};
