const baseUrl = new URL(process.argv[2] || "http://127.0.0.1:3100");
const expectedCanonicalOrigin = "https://www.exfinityventures.com";
const failures = [];

function decode(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function match(html, expression) {
  return decode(html.match(expression)?.[1]?.trim() || "");
}

function meta(html, key, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((candidate) =>
    new RegExp(`${key}=["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(candidate)
  );
  return tag ? match(tag, /content=["']([^"']*)["']/i) : "";
}

function links(html) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"'#?]+)["']/gi)].map((entry) => decode(entry[1]));
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "manual" });
  return { response, text: await response.text() };
}

function localUrl(url) {
  const parsed = new URL(url, expectedCanonicalOrigin);
  return new URL(parsed.pathname + parsed.search, baseUrl);
}

const { response: robotsResponse, text: robots } = await fetchText(new URL("/robots.txt", baseUrl));
if (robotsResponse.status !== 200) failures.push(`robots.txt: HTTP ${robotsResponse.status}`);
if (!/Allow:\s*\//i.test(robots)) failures.push("robots.txt: missing Allow: /");
if (!/Sitemap:\s*https:\/\/www\.exfinityventures\.com\/sitemap\.xml/i.test(robots)) failures.push("robots.txt: incorrect sitemap URL");

const { response: sitemapResponse, text: sitemap } = await fetchText(new URL("/sitemap.xml", baseUrl));
if (sitemapResponse.status !== 200) failures.push(`sitemap.xml: HTTP ${sitemapResponse.status}`);
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((entry) => decode(entry[1]));
if (sitemapUrls.length <= 10) failures.push("sitemap.xml: too few public routes");
if (!sitemapUrls.includes(`${expectedCanonicalOrigin}/portfolio/agshift`)) failures.push("sitemap.xml: AgShift is missing");
if (sitemapUrls.includes(`${expectedCanonicalOrigin}/team/rahul-sasi`)) failures.push("sitemap.xml: Rahul Sasi is still listed");

const pages = [];
for (let index = 0; index < sitemapUrls.length; index += 8) {
  const batch = sitemapUrls.slice(index, index + 8);
  pages.push(...await Promise.all(batch.map(async (canonicalUrl) => {
    const { response, text } = await fetchText(localUrl(canonicalUrl));
    return { canonicalUrl, response, html: text };
  })));
}

const titles = new Map();
const descriptions = new Map();
const internalPaths = new Set();

for (const page of pages) {
  const path = new URL(page.canonicalUrl).pathname;
  const title = match(page.html, /<title[^>]*>(.*?)<\/title>/is);
  const description = meta(page.html, "name", "description");
  const canonical = match(page.html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || match(page.html, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const h1Count = (page.html.match(/<h1\b/gi) || []).length;
  const jsonLdBlocks = [...page.html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis)];

  if (page.response.status !== 200) failures.push(`${path}: HTTP ${page.response.status}`);
  if (!title) failures.push(`${path}: missing title`);
  if (!description) failures.push(`${path}: missing meta description`);
  if (canonical !== page.canonicalUrl) failures.push(`${path}: canonical is ${canonical || "missing"}`);
  if (h1Count !== 1) failures.push(`${path}: expected one H1, found ${h1Count}`);
  if (!meta(page.html, "property", "og:title")) failures.push(`${path}: missing og:title`);
  if (!meta(page.html, "property", "og:description")) failures.push(`${path}: missing og:description`);
  if (!meta(page.html, "property", "og:image")) failures.push(`${path}: missing og:image`);
  if (!meta(page.html, "name", "twitter:card")) failures.push(`${path}: missing twitter:card`);
  if (!meta(page.html, "name", "twitter:image")) failures.push(`${path}: missing twitter:image`);
  if (/noindex/i.test(meta(page.html, "name", "robots"))) failures.push(`${path}: unexpectedly noindex`);

  for (const block of jsonLdBlocks) {
    try { JSON.parse(block[1]); } catch { failures.push(`${path}: invalid JSON-LD`); }
  }

  if (titles.has(title)) failures.push(`${path}: duplicate title with ${titles.get(title)}`);
  else titles.set(title, path);
  if (descriptions.has(description)) failures.push(`${path}: duplicate description with ${descriptions.get(description)}`);
  else descriptions.set(description, path);

  for (const href of links(page.html)) {
    if (href.startsWith("/")) internalPaths.add(href);
  }
}

const internalPathList = [...internalPaths];
for (let index = 0; index < internalPathList.length; index += 10) {
  await Promise.all(internalPathList.slice(index, index + 10).map(async (path) => {
    const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
    if (response.status >= 400) failures.push(`internal link ${path}: HTTP ${response.status}`);
  }));
}

const rahul = await fetch(new URL("/team/rahul-sasi", baseUrl), { redirect: "manual" });
if (rahul.status !== 404) failures.push(`/team/rahul-sasi: expected 404, found ${rahul.status}`);

const teamHtml = (await fetchText(new URL("/team?tab=tac", baseUrl))).text;
if (/Rahul Sasi/i.test(teamHtml)) failures.push("/team?tab=tac: Rahul Sasi is still present");
const portfolioHtml = (await fetchText(new URL("/portfolio", baseUrl))).text;
if (!/Agshift/i.test(portfolioHtml)) failures.push("/portfolio: AgShift is missing");

console.log(JSON.stringify({
  baseUrl: baseUrl.href,
  sitemapPages: pages.length,
  internalLinksChecked: internalPaths.size,
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
