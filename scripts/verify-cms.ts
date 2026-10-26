import assert from "node:assert/strict";
import { getCliClient } from "@sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-01", useCdn: false });
const types = ["homepageStats", "homepageCompanies", "homepageBacking", "homepageFounders", "contactFaqs", "teamPage", "portfolioPage"];
const documents = await client.fetch('*[_type in $types && !(_id in path("drafts.**"))]', { types }, { perspective: "published" });
for (const type of types) assert.equal(documents.filter((doc: { _type: string }) => doc._type === type).length, 1, `Expected one published ${type}`);
let imageCount = 0;
function checkImages(value: unknown) {
  if (!value || typeof value !== "object") return;
  const item = value as { _type?: string; asset?: { _ref?: string } };
  if (item._type === "image") {
    assert.ok(item.asset?._ref?.startsWith("image-"), "Image must reference an uploaded asset");
    imageCount++;
  }
  for (const child of Object.values(value)) checkImages(child);
}
checkImages(documents);
const team = documents.find((doc: { _type: string }) => doc._type === "teamPage");
assert.equal(team.tacTeam.find((member: { name: string }) => member.name === "Rahul Sasi")?.hideFromTeamPage, true);
const portfolio = documents.find((doc: { _type: string }) => doc._type === "portfolioPage");
assert.ok(portfolio.companies.some((company: { slug: { current: string }; hideFromPortfolio?: boolean }) => company.slug.current === "agshift" && !company.hideFromPortfolio));
console.log(JSON.stringify({ publishedSections: documents.length, uploadedImageReferences: imageCount, portfolioCompanies: portfolio.companies.length, faqCount: documents.find((d: { _type: string }) => d._type === "contactFaqs").faqs.length, newsPosts: await client.fetch('count(*[_type == "blogPost" && !(_id in path("drafts.**"))])') }));

if (process.env.CMS_VERIFY_EDIT === "1") {
  const origin = process.env.CMS_VERIFY_ORIGIN || "http://localhost:3100";
  const document = documents.find((doc: { _type: string }) => doc._type === "homepageCompanies");
  const testHeading = `${document.heading} `; // A visually neutral change, restored below.
  const edited = await client.patch(document._id).ifRevisionId(document._rev).set({ heading: testHeading }).commit();
  try {
    const response = await fetch(origin, { cache: "no-store", signal: AbortSignal.timeout(30000) });
    assert.ok(response.ok);
    const html = await response.text();
    const heading = html.match(/id="companies-title">([^<]*)<\/div>/)?.[1];
    assert.equal(heading, testHeading, "Published edit should appear in rendered HTML without rebuild");
    console.log("Published edit reached rendered HTML without a rebuild.");
  } finally {
    await client.patch(document._id).ifRevisionId(edited._rev).set({ heading: document.heading }).commit();
    console.log("Original heading restored.");
  }
}
