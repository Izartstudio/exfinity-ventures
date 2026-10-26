/** Seed missing sections only. Run through Sanity CLI with --with-user-token. */
import { getCliClient } from "@sanity/cli";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fallbackPortfolioWall } from "../content/portfolio";
import { fallbackFounders } from "../content/homepage-founders";
import { companiesDefaults, backingDefaults } from "../content/homepage-sections";
import { fallbackTeamPage } from "../lib/sanity/team";
import { fallbackStats } from "../lib/sanity/homepage";
import { teamMemberSlug } from "../content/team";
import faqs from "../content/contact-faqs.json";

const client = getCliClient({ apiVersion: "2026-10-01", useCdn: false });
const dryRun = process.env.CMS_IMPORT_APPLY !== "1";
const types = ["homepageCompanies", "homepageBacking", "homepageFounders", "homepageStats", "contactFaqs", "teamPage", "portfolioPage"];
const existing = await client.fetch('*[_type in $types]', { types }, { perspective: "raw" });
const newsCount = await client.fetch('count(*[_type == "blogPost" && !(_id in path("drafts.**"))])');
console.log(JSON.stringify({ projectId: client.config().projectId, dataset: client.config().dataset, dryRun, newsCount, existing: existing.map((d: { _id: string; _type: string }) => ({ id: d._id, type: d._type })) }, null, 2));

// Keep a local pre-import backup; no existing document is replaced or patched.
if (!dryRun) {
  await mkdir(".cms-backups", { recursive: true });
  await writeFile(`.cms-backups/before-${Date.now()}.json`, JSON.stringify(existing, null, 2));
}

const assets = new Map<string, Promise<object>>();
async function image(path: string | undefined): Promise<object | undefined> {
  if (!path) return undefined;
  if (dryRun) return { _type: "image", asset: { _type: "reference", _ref: "dry-run" } };
  if (!assets.has(path)) assets.set(path, (async () => {
    const sourceId = createHash("sha256").update(path).digest("hex");
    const known = await client.fetch('*[_type == "sanity.imageAsset" && source.id == $id][0]._id', { id: sourceId });
    let id = known;
    if (!id) {
      let bytes: Buffer;
      if (path.startsWith("/")) bytes = await readFile(resolve("public", `.${decodeURIComponent(path)}`));
      else {
        const response = await fetch(path, { signal: AbortSignal.timeout(60000) });
        if (!response.ok) throw new Error(`Image unavailable: ${path} (${response.status})`);
        bytes = Buffer.from(await response.arrayBuffer());
      }
      const asset = await client.assets.upload("image", bytes, {
        filename: path.split("/").pop(),
        source: { id: sourceId, name: "Exfinity website content", url: new URL(path, "https://exfinity-ventures.vercel.app").href },
      });
      id = asset._id;
    }
    return { _type: "image", asset: { _type: "reference", _ref: id } };
  })());
  return assets.get(path)!;
}

const builders: Record<string, () => Promise<object>> = {
  homepageStats: async () => ({ stats: fallbackStats.map((s, i) => ({ ...s, _key: `stat-${i}`, _type: "stat" })) }),
  contactFaqs: async () => faqs,
  homepageFounders: async () => ({ heading: "What Our Founders Say", layout: "three", founders: await Promise.all(fallbackFounders.map(async (f, i) => ({ ...f, _key: `founder-${i}`, _type: "founder", image: await image(f.imageUrl), logo: await image(f.logoUrl) }))) }),
  homepageCompanies: async () => ({ ...companiesDefaults, companies: await Promise.all(companiesDefaults.companies.map(async (c, i) => ({ ...c, _key: `company-${i}`, _type: "company", logoImage: await image(c.logo) }))) }),
  homepageBacking: async () => ({ ...backingDefaults, cards: await Promise.all(backingDefaults.cards.map(async (c) => ({ ...c, _key: c.id, _type: "backingCard", cardImage: await image(c.image), companies: await Promise.all(c.companies.map(async (company, i) => ({ ...company, _key: `company-${i}`, _type: "popupCompany", logoImage: await image(company.logo), whiteLogoImage: await image(company.logoWhite) }))) }))) }),
  portfolioPage: async () => ({ sectionLabel: fallbackPortfolioWall.sectionLabel, companies: await Promise.all(fallbackPortfolioWall.companies.map(async ({ id, ...company }) => ({ ...company, _key: id, _type: "portfolioCompany", slug: { _type: "slug", current: id }, logo: await image(company.logo), logoWhite: await image(company.logoWhite) }))) }),
  teamPage: async () => {
    const page = fallbackTeamPage();
    return { ...page,
      ...Object.fromEntries(await Promise.all((["partners", "founders", "investmentTeam", "tacTeam"] as const).map(async (group) => [group, await Promise.all(page[group].map(async (m, i) => ({ ...m, _key: `${group}-${i}`, _type: "teamMember", slug: { _type: "slug", current: m.slug || teamMemberSlug(m.name) }, image: await image(m.image), profileImage: await image(m.profileImage) })))]))),
      offices: await Promise.all((page.offices ?? []).map(async (o, i) => ({ ...o, _key: `office-${i}`, _type: "office", image: await image(o.image) }))),
    };
  },
};

for (const type of types) {
  const published = existing.find((doc: { _type: string; _id: string }) => doc._type === type && !doc._id.startsWith("drafts."));
  const draft = existing.find((doc: { _type: string; _id: string }) => doc._type === type && doc._id.startsWith("drafts."));
  if (published) {
    console.log(`Preserved existing published ${type}.`);
    continue;
  }
  // Seed the live-site baseline beside an existing unpublished draft. The draft
  // stays untouched, with the same document identity and all editorial changes.
  const document = { _id: draft?._id.replace(/^drafts\./, "") ?? type, _type: type, ...await builders[type]() };
  if (!dryRun) await client.createIfNotExists(document);
  console.log(`${dryRun ? "Would publish" : "Published"} ${type}${draft ? " (existing draft preserved)" : ""}`);
}
console.log(dryRun ? "Dry run only. Set CMS_IMPORT_APPLY=1 to publish missing sections." : "Import complete; existing content preserved.");
