"""One-time legacy news export. Requires beautifulsoup4; preserves original copy/media."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import subprocess
from urllib.parse import urljoin
from bs4 import BeautifulSoup, NavigableString

BASE = "https://www.exfinityventures.com"
CACHE = Path("/tmp/exfinity-news-migration")
CACHE.mkdir(exist_ok=True)
ROOT = Path(__file__).resolve().parents[1]
ALIASES = {
    "exf-physical-ai": "physical-ai-thesis",
    "exfinity-inside-india-2026-danish-delegation": "inside-india-2026",
    "exfinity-fund-iv-1100-crore-deep-tech": "fund-four",
    "cloudsek-first-indian-origin-cybersecurity-us-state-fund-investment": "cloudsek-state-fund",
    "chara-technologies-raises-rs-52-crore-to-expand-rare-earth-free-motor-manufacturing": "chara-series-a",
    "ikea-arm-acquires-india-born-logistics-tech-startup-locus": "ikea-locus",
    "deeptech-startup-maieutic-semiconductor-raises-4-15-million-from-exfinity-venture-partners": "maieutic-funding",
}

def page(url):
    file = CACHE / (hashlib.sha256(url.encode()).hexdigest() + ".html")
    if not file.exists():
        subprocess.run(["curl", "-fLsS", "--retry", "3", "--max-time", "60", url, "-o", str(file)], check=True)
    return BeautifulSoup(file.read_text(), "html.parser")

def spans(node, marks=None, href=None):
    marks = marks or []
    if isinstance(node, NavigableString):
        return [{"text": str(node), **({"marks": marks} if marks else {}), **({"href": href} if href else {})}]
    if node.name == "br":
        return [{"text": "\n"}]
    mark = {"strong": "bold", "b": "bold", "em": "italic", "i": "italic", "u": "underline", "s": "strike", "sup": "sup", "sub": "sub", "code": "code"}.get(node.name)
    if node.name == "a" and node.get("href"):
        href = urljoin(BASE, node["href"])
    return [s for child in node.children for s in spans(child, marks + ([mark] if mark else []), href)]

def blocks(node):
    result = []
    for child in node.children:
        if isinstance(child, NavigableString):
            if child.strip(): result.append({"type": "paragraph", "children": spans(child)})
            continue
        if child.name in ("script", "style"): continue
        if child.name == "figure" or child.name == "img":
            img = child if child.name == "img" else child.find("img")
            if img and img.get("src"):
                caption = child.find("figcaption")
                link = child.find("a", href=True)
                result.append({"type": "image", "src": urljoin(BASE, img["src"]), "alt": img.get("alt", ""), **({"caption": caption.get_text()} if caption else {}), **({"href": urljoin(BASE, link["href"])} if link else {})})
            else:
                for embed in child.select("iframe[src]"):
                    result.append({"type": "paragraph", "children": [{"text": "View original media", "href": urljoin(BASE, embed["src"])}]})
        elif child.name in ("ul", "ol"):
            result.append({"type": "list", "style": "number" if child.name == "ol" else "bullet", "items": [spans(li) for li in child.find_all("li", recursive=False)]})
        elif child.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
            result.append({"type": "heading", "level": min(4, max(2, int(child.name[1]))), "children": spans(child)})
        elif child.name == "blockquote":
            result.append({"type": "quote", "children": spans(child)})
        elif child.name == "hr": result.append({"type": "divider"})
        elif child.name == "p":
            if child.get_text().replace("\u200d", "").strip(): result.append({"type": "paragraph", "children": spans(child)})
            for image in child.select("img"):
                result.append({"type": "image", "src": urljoin(BASE, image["src"]), "alt": image.get("alt", "")})
        else: result.extend(blocks(child))
    return result

def article(card):
    source = urljoin(BASE, card["href"])
    doc = page(source)
    main = doc.select_one(".section_media-internal")
    if not main: raise ValueError("Missing article: " + source)
    body = [b for rich in main.select(".text-rich-text.w-richtext") for b in blocks(rich)]
    for embed in main.select(".podcast-embed iframe[src]"):
        body.insert(0, {"type": "embed", "src": embed["src"], "title": "Podcast episode"})
    more = next((a["href"] for a in main.select("a[href]") if "read more" in a.get_text(" ", strip=True).lower()), None)
    if more:
        body = [b for b in body if not (b["type"] == "paragraph" and len(b["children"]) == 1 and b["children"][0].get("href") == more and b["children"][0]["text"].lower().startswith("read more"))]
    legacy = card["href"].split("/")[-1]
    slug = ALIASES.get(legacy, legacy)
    return {"id": slug, "slug": "/news/" + slug, "title": card.select_one(".media-title").get_text(), "date": card.select_one(".media-company-name").get_text(), "category": card.select_one('[fs-cmsfilter-field="type"]').get_text(), "image": card.select_one("img")["src"], "body": body, "legacyPath": card["href"], "originalUrl": source, **({"externalUrl": urljoin(BASE, more)} if more else {})}

cards = {}
url = BASE + "/news"
seen = set()
while url and url not in seen:
    seen.add(url)
    doc = page(url)
    for card in doc.select(".media-list .news-card"):
        cards[card["href"]] = card
    next_page = doc.select_one("a.w-pagination-next")
    url = urljoin(BASE + "/news", next_page["href"]) if next_page else None
    print(f"Collected {len(cards)} articles across {len(seen)} listing pages", flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    articles = list(pool.map(article, cards.values()))
(ROOT / "content/news-archive.json").write_text(json.dumps(articles, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"articles": len(articles), "emptyBodies": [a["id"] for a in articles if not a["body"]], "images": sum(1 + sum(b["type"] == "image" for b in a["body"]) for a in articles)}, indent=2))
