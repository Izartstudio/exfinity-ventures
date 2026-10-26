import { getCliClient } from "@sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-01", useCdn: false });
const documents = await client.fetch('*[_type == "homepageFounders"]{_id,_rev,founders}', {}, { perspective: "raw" });
let transaction = client.transaction();
let count = 0;
for (const document of documents) {
  const fields: Record<string, string> = {};
  for (const founder of document.founders ?? []) {
    if (founder.name !== "Shubham Mishra" || typeof founder.quote !== "string") continue;
    const quote = founder.quote.replace(/\b1st\b/g, "first");
    if (quote !== founder.quote) fields[`founders[_key==${JSON.stringify(founder._key)}].quote`] = quote;
  }
  if (!Object.keys(fields).length) continue;
  transaction = transaction.patch(document._id, (patch) => patch.ifRevisionId(document._rev).set(fields));
  count++;
}
if (count) await transaction.commit();
console.log(`Updated Pixis testimonial in ${count} CMS document(s), including matching drafts.`);
