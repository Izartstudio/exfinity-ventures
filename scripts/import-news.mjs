// Run: NEWS_IMPORT_DRY_RUN=1 npm run news:import, then npm run news:import
// Uses the signed-in Sanity CLI session. Never prints credentials.
import { getCliClient } from "@sanity/cli";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const client = getCliClient({ apiVersion: "2026-10-01", useCdn: false });
const archive = JSON.parse(await readFile(new URL("../content/news-archive.json", import.meta.url), "utf8"));
const dryRun = process.env.NEWS_IMPORT_DRY_RUN === "1";
const existing = await client.fetch('*[_type == "blogPost"]{_id,"slug":slug.current}');
const hash = text => createHash("sha256").update(text).digest("hex").slice(0, 24);
const imageCache = new Map();

async function image(url) {
  if (!imageCache.has(url)) {
    imageCache.set(url, (async () => {
      const sourceId = hash(url);
      const known = await client.fetch('*[_type == "sanity.imageAsset" && source.id == $id][0]._id', { id: sourceId });
      if (known) return { _type: "reference", _ref: known };
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`Image download failed (${response.status})`);
      const buffer = Buffer.from(await response.arrayBuffer());
      const asset = await client.assets.upload("image", buffer, {
        filename: decodeURIComponent(new URL(url).pathname.split("/").pop()),
        source: { id: sourceId, name: "Exfinity legacy news archive", url },
      });
      return { _type: "reference", _ref: asset._id };
    })());
  }
  return imageCache.get(url);
}

function textBlock(children, key, extra = {}) {
  const markDefs = [];
  const mapped = children.map((span, i) => {
    const marks = (span.marks ?? []).map(mark => ({ bold: "strong", italic: "em" })[mark] ?? mark);
    if (span.href) {
      const id = `link${i}`;
      markDefs.push({ _key: id, _type: "link", href: span.href });
      marks.push(id);
    }
    return { _key: `span${i}`, _type: "span", text: span.text, marks };
  });
  return { _type: "block", _key: key, style: "normal", children: mapped, markDefs, ...extra };
}

async function portableBody(body) {
  const output = [];
  for (const [index, block] of body.entries()) {
    const key = `block${index}`;
    if (block.type === "image") output.push({ _type: "postImage", _key: key, asset: await image(block.src), alt: block.alt, caption: block.caption, linkUrl: block.href });
    else if (block.type === "embed") output.push({ _type: "mediaEmbed", _key: key, title: block.title, url: block.src });
    else if (block.type === "list") block.items.forEach((children, i) => output.push(textBlock(children, `${key}-${i}`, { listItem: block.style, level: 1 })));
    else if (block.type === "divider") output.push({ _type: "divider", _key: key, label: "Divider" });
    else output.push(textBlock(block.children, key, { style: block.type === "heading" ? `h${block.level}` : block.type === "quote" ? "blockquote" : "normal" }));
  }
  return output;
}

let added = 0;
let skipped = 0;
for (const article of archive) {
  const slug = article.slug.slice("/news/".length);
  const id = `legacy-news-${hash(article.originalUrl)}`;
  if (existing.some(post => post.slug === slug || post._id.replace(/^drafts\./, "") === id)) {
    skipped++;
    continue;
  }
  if (!dryRun) {
    const doc = {
      _id: id, _type: "blogPost", title: article.title,
      slug: { _type: "slug", current: slug }, category: article.category,
      publishedAt: new Date(`${article.date} 00:00:00 UTC`).toISOString(),
      heroImage: { _type: "image", asset: await image(article.image), alt: article.title },
      body: await portableBody(article.body), sourceUrl: article.externalUrl,
    };
    await client.createIfNotExists(doc);
  }
  added++;
  console.log(`${dryRun ? "Would import" : "Imported"}: ${article.title}`);
}
console.log(`${dryRun ? "Planned" : "Completed"}: ${added} new posts; ${skipped} existing posts preserved.`);
