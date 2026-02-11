#!/usr/bin/env python3
import hashlib
import json
import re
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
CONTENT_DIR = ROOT / "content"
ASSETS_DIR = ROOT / "public" / "assets"
UA = {"User-Agent": "Mozilla/5.0 (compatible; SapMigrator/1.0)"}


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Zа-яА-Я0-9]+", "-", value.lower()).strip("-")
    return value or "item"


def fetch(url: str) -> Optional[BeautifulSoup]:
    try:
        response = requests.get(url, headers=UA, timeout=20)
        response.raise_for_status()
        return BeautifulSoup(response.text, "lxml")
    except Exception:
        return None


def extract_specs(node) -> Dict[str, str]:
    specs: Dict[str, str] = {}
    for row in node.select("tr"):
        cols = [clean_text(c.get_text(" ")) for c in row.select("th,td") if clean_text(c.get_text(" "))]
        if len(cols) >= 2:
            specs[cols[0]] = cols[1]
    return specs


def download_image(url: str, prefix: str) -> Optional[str]:
    if not url:
        return None
    try:
        parsed = urlparse(url)
        ext = Path(parsed.path).suffix or ".jpg"
        name = f"{prefix}-{hashlib.md5(url.encode()).hexdigest()[:10]}{ext}"
        target = ASSETS_DIR / name
        if not target.exists():
            data = requests.get(url, headers=UA, timeout=25)
            data.raise_for_status()
            target.write_bytes(data.content)
        return f"/assets/{name}"
    except Exception:
        return None


def parse_led_modules() -> Dict:
    base = "https://led-modules.ru/"
    home = fetch(base)
    result = {
        "title": "LED Modules",
        "source_url": base,
        "contacts": {},
        "categories": []
    }
    if not home:
        return result

    phones = [clean_text(a.get_text(" ")) for a in home.select("a[href^='tel:']")]
    emails = [clean_text(a.get_text(" ")) for a in home.select("a[href^='mailto:']")]
    result["contacts"] = {"phones": sorted(set(phones)), "emails": sorted(set(emails))}

    cat_links = []
    for a in home.select("a[href*='catalog'], a[href*='katalog']"):
        href = a.get("href")
        if href:
            cat_links.append(urljoin(base, href))

    seen = set()
    for cat_url in cat_links[:15]:
        if cat_url in seen:
            continue
        seen.add(cat_url)
        cat_page = fetch(cat_url)
        if not cat_page:
            continue
        cat_name = clean_text(cat_page.select_one("h1").get_text(" ")) if cat_page.select_one("h1") else clean_text(cat_url)
        category = {
            "name": cat_name,
            "slug": slugify(cat_name),
            "source_url": cat_url,
            "items": []
        }
        product_links = []
        for a in cat_page.select("a[href]"):
            href = a.get("href")
            text = clean_text(a.get_text(" "))
            if href and len(text) > 3 and ("product" in href or "товар" in href or "catalog" in href):
                product_links.append(urljoin(cat_url, href))

        unique_links = list(dict.fromkeys(product_links))[:40]
        for p_url in unique_links:
            p_page = fetch(p_url)
            if not p_page:
                continue
            title_node = p_page.select_one("h1")
            title = clean_text(title_node.get_text(" ")) if title_node else clean_text(p_url)
            description = clean_text(" ".join([n.get_text(" ") for n in p_page.select("p")][:4]))
            specs = {}
            table = p_page.select_one("table")
            if table:
                specs = extract_specs(table)
            imgs = []
            for img in p_page.select("img[src]")[:8]:
                src = urljoin(p_url, img.get("src"))
                local = download_image(src, slugify(title))
                if local:
                    imgs.append(local)
            category["items"].append({
                "name": title,
                "slug": slugify(title),
                "description": description,
                "specs": specs,
                "images": imgs,
                "source_url": p_url
            })
        if category["items"]:
            result["categories"].append(category)
    return result


def parse_sapphire() -> Dict:
    base = "https://sapphire-led.com/"
    home = fetch(base)
    result = {
        "title": "Sapphire LED",
        "source_url": base,
        "advantages": [],
        "series": [],
        "contacts": {}
    }
    if not home:
        return result

    texts = [clean_text(li.get_text(" ")) for li in home.select("li, .advantage, .benefit") if 8 < len(clean_text(li.get_text(" "))) < 160]
    result["advantages"] = list(dict.fromkeys(texts))[:12]

    phones = [clean_text(a.get_text(" ")) for a in home.select("a[href^='tel:']")]
    emails = [clean_text(a.get_text(" ")) for a in home.select("a[href^='mailto:']")]
    result["contacts"] = {"phones": sorted(set(phones)), "emails": sorted(set(emails))}

    product_links = []
    for a in home.select("a[href]"):
        href = a.get("href")
        text = clean_text(a.get_text(" "))
        if href and len(text) > 3 and ("series" in href.lower() or "product" in href.lower() or "produk" in href.lower()):
            product_links.append(urljoin(base, href))

    for url in list(dict.fromkeys(product_links))[:30]:
        page = fetch(url)
        if not page:
            continue
        title = clean_text(page.select_one("h1").get_text(" ")) if page.select_one("h1") else clean_text(url)
        descr = clean_text(" ".join([p.get_text(" ") for p in page.select("p")][:4]))
        specs = extract_specs(page.select_one("table")) if page.select_one("table") else {}
        imgs = []
        for img in page.select("img[src]")[:6]:
            local = download_image(urljoin(url, img.get("src")), slugify(title))
            if local:
                imgs.append(local)
        result["series"].append({
            "name": title,
            "slug": slugify(title),
            "description": descr,
            "specs": specs,
            "images": imgs,
            "source_url": url
        })

    return result


def main() -> None:
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    led_modules = parse_led_modules()
    sapphire = parse_sapphire()

    (CONTENT_DIR / "modules.json").write_text(json.dumps(led_modules, ensure_ascii=False, indent=2), encoding="utf-8")
    (CONTENT_DIR / "sapphire.json").write_text(json.dumps(sapphire, ensure_ascii=False, indent=2), encoding="utf-8")

    combined = {
        "updated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "source_urls": ["https://led-modules.ru/", "https://sapphire-led.com/"],
        "source_url": "https://led-modules.ru/ & https://sapphire-led.com/"
    }
    (CONTENT_DIR / "sources.json").write_text(json.dumps(combined, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Scraping complete")


if __name__ == "__main__":
    main()
