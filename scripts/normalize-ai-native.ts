import { getCliClient } from "@sanity/cli";
import { mkdir, writeFile } from "node:fs/promises";

const client = getCliClient({ apiVersion: "2026-10-01", useCdn: false });
const apply = process.env.CMS_NORMALIZE_APPLY === "1";
const documents = await client.fetch('*[_type in $types]', {
  types: ["homepageStats", "homepageCompanies", "homepageBacking", "homepageFounders", "contactFaqs", "teamPage", "portfolioPage", "blogPost"],
}, { perspective: "raw" });

// Keep document identities, links, file paths, and asset references unchanged.
const protectedKeys = /^(?:_|id$|slug$|href$|.*(?:url|image|logo|src|path|position|companyids|relatedids)$)/i;
function normalize(value: unknown, key = ""): unknown {
  if (protectedKeys.test(key)) return value;
  if (typeof value === "string") {
    if (/^(?:https?:|mailto:|tel:|\/)/i.test(value)) return value;
    return value.replace(/\bAI(?:[\s\u00a0]+|[-\u2010-\u2014])native\b/gi, "AI-Native");
  }
  if (Array.isArray(value)) return value.map((item) => normalize(item));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, normalize(item, name)]));
  return value;
}

const changes = documents.flatMap((document: Record<string, unknown> & { _id: string; _rev: string }) => {
  const next = normalize(document) as Record<string, unknown>;
  const fields = Object.fromEntries(Object.entries(next).filter(([key, value]) => !key.startsWith("_") && JSON.stringify(value) !== JSON.stringify(document[key])));
  return Object.keys(fields).length ? [{ document, fields }] : [];
});
console.log(JSON.stringify({ apply, changedDocuments: changes.map(({ document, fields }: { document: { _id: string }; fields: object }) => ({ id: document._id, fields: Object.keys(fields) })) }, null, 2));
if (apply && changes.length) {
  await mkdir(".cms-backups", { recursive: true });
  await writeFile(`.cms-backups/ai-native-${Date.now()}.json`, JSON.stringify(changes.map(({ document }: { document: object }) => document), null, 2));
  let transaction = client.transaction();
  for (const { document, fields } of changes) transaction = transaction.patch(document._id, (patch) => patch.ifRevisionId(document._rev).set(fields));
  await transaction.commit();
  console.log(`Updated ${changes.length} CMS documents, including any matching drafts.`);
} else console.log(apply ? "CMS wording is already consistent." : "Preview only; set CMS_NORMALIZE_APPLY=1 to apply.");
