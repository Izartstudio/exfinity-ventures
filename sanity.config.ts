"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const singletonTypes = new Set(["homepageStats", "homepageCompanies", "homepageBacking", "homepageFounders", "contactFaqs", "teamPage", "portfolioPage"]);

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET",
  );
}

export default defineConfig({
  name: "exfinity",
  title: "Exfinity Ventures",
  projectId,
  dataset,
  plugins: [structureTool({
    structure: (S, context) => S.list().title("Website content").items([
      ...schemaTypes.filter((schema) => singletonTypes.has(schema.name)).map((schema) =>
        S.listItem().id(schema.name).title(schema.title ?? schema.name).child(async () => {
          const client = context.getClient({ apiVersion: "2026-10-01" });
          const documents = await client.fetch<{ _id: string }[]>('*[_type == $type] | order(_updatedAt desc){_id}', { type: schema.name }, { perspective: "raw" });
          const published = documents.find((doc) => !doc._id.startsWith("drafts."));
          const id = (published?._id ?? documents[0]?._id ?? schema.name).replace(/^drafts\./, "");
          return S.document().schemaType(schema.name).documentId(id);
        }),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? "")),
    ]),
  }), visionTool()],
  document: {
    actions: (actions, context) => singletonTypes.has(context.schemaType)
      ? actions.filter((action) => action.action !== "duplicate" && action.action !== "delete" && action.action !== "unpublish")
      : actions,
  },
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !singletonTypes.has(template.schemaType)),
  },
});
