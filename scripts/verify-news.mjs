// Read-only verification: npm run news:verify
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getCliClient } from "@sanity/cli";
import { portableToRichText } from "../lib/sanity/news-content.ts";

const client = getCliClient({ apiVersion: "2026-10-01", useCdn: false });
const archive = JSON.parse(await readFile(new URL("../content/news-archive.json", import.meta.url), "utf8"));
const posts = await client.fetch(`*[_type == "blogPost" && !(_id in path("drafts.**"))]{
  title, "slug":slug.current, category, publishedAt, sourceUrl,
  "originalImage":heroImage.asset->source.url,
  body[]{..., "src":asset->source.url}
}`);
const normalise = value => JSON.parse(JSON.stringify(value, (_, v) => v === undefined || v === false || (Array.isArray(v) && v.length === 0) ? undefined : v));
let images = 0;
for (const article of archive) {
  const post = posts.find(post => `/news/${post.slug}` === article.slug);
  assert.ok(post, `Missing published post: ${article.slug}`);
  assert.equal(post.title, article.title);
  assert.equal(post.category ?? "", article.category);
  assert.equal(post.originalImage, article.image);
  assert.equal(post.sourceUrl ?? undefined, article.externalUrl);
  assert.equal(Date.parse(post.publishedAt), Date.parse(`${article.date} 00:00:00 UTC`));
  assert.deepEqual(normalise(portableToRichText(post.body)), normalise(article.body), `Body mismatch: ${article.slug}`);
  images += 1 + article.body.filter(b => b.type === "image").length;
}
console.log(`Verified ${archive.length} published articles, ${images} original image references, dates, categories, formatted bodies, links and podcast players.`);
