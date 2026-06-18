// Crawl the real layered-nav filter attributes for the Deutsch catalogue so our
// native catalogue can offer the SAME filters as the original storefront.
//
//   node scripts/crawlers/crawl-deutsch-attributes.mjs
//
// For each chosen attribute, we read its options from the layered nav, then visit
// each option's filtered listing (following pagination) and record which part
// numbers match — giving an accurate per-product attribute map plus option counts.
//
// Output: src/data/generated/deutsch-attributes.json
import * as cheerio from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const GENERATED_DIR = join(ROOT, "src/data/generated");

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}

const ORIGIN = "https://www.adcontact.se";
const BASE = arg("base", "/webshop/components/sealed-connectors/deutsch/connectors.html");
const OUT_FILE = join(GENERATED_DIR, arg("out", "deutsch-attributes.json"));
const DELAY_MS = Number(process.env.CRAWL_DELAY_MS ?? 200);
const RETRIES = 4;

// Attributes to mirror from the original layered nav, in display order.
const ATTRIBUTES = arg(
  "attrs",
  "Series,No. of cavities,Current Rating,Contact Size,Connector Style,Color"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const clean = (v) => (v ?? "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Adcontact catalogue build)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === RETRIES) throw err;
      await sleep(DELAY_MS * attempt * 2);
    }
  }
  throw new Error("unreachable");
}

function parseProducts($) {
  const out = [];
  $("h2.product-name a").each((_, a) => {
    const name = clean($(a).attr("title")) || clean($(a).text());
    if (name) out.push(name);
  });
  return out;
}

const PAGE_SIZE = 25;
const MAX_PAGES = 80; // safety cap (largest option ~431 products → ~18 pages)

// Read the layered nav -> { attrName: [{ label, count, href }] }
function parseLayeredNav($) {
  const groups = {};
  $("#narrow-by-list dt").each((_, dt) => {
    const name = clean($(dt).text());
    const dd = $(dt).next("dd");
    const options = [];
    dd.find("li").each((__, li) => {
      const a = $(li).find("a").first();
      const href = a.attr("href");
      if (!href) return;
      // label = anchor text minus the trailing "(123)" count
      const raw = clean(a.text());
      const cm = raw.match(/\((\d+)\)\s*$/);
      const count = cm ? Number(cm[1]) : null;
      const label = clean(raw.replace(/\((\d+)\)\s*$/, ""));
      options.push({ label, count, href });
    });
    if (options.length) groups[name] = options;
  });
  return groups;
}

async function crawlOption(href) {
  const url = href.startsWith("http") ? href : `${ORIGIN}${href}`;
  const sep = url.includes("?") ? "&" : "?";
  const parts = new Set();
  // Paginate until a page returns fewer than a full page of products.
  for (let p = 1; p <= MAX_PAGES; p += 1) {
    const pageUrl = p === 1 ? url : `${url}${sep}p=${p}`;
    let found;
    try {
      found = parseProducts(cheerio.load(await fetchHtml(pageUrl)));
    } catch {
      break;
    }
    if (found.length === 0) break;
    for (const n of found) parts.add(n);
    if (found.length < PAGE_SIZE) break;
    await sleep(DELAY_MS);
  }
  return [...parts];
}

async function main() {
  console.log("Reading layered nav…");
  const $ = cheerio.load(await fetchHtml(`${ORIGIN}${BASE}`));
  const nav = parseLayeredNav($);

  const attributes = [];
  const products = {}; // partNumber -> { attr: label }

  for (const attr of ATTRIBUTES) {
    const options = nav[attr];
    if (!options) {
      console.warn(`  ! attribute "${attr}" not found in layered nav, skipping`);
      continue;
    }
    console.log(`\n${attr} — ${options.length} options`);
    const outOptions = [];
    for (const opt of options) {
      const parts = await crawlOption(opt.href);
      for (const pn of parts) {
        (products[pn] ||= {})[attr] = opt.label;
      }
      outOptions.push({ label: opt.label, count: parts.length });
      console.log(`  ${opt.label}: ${parts.length} (nav said ${opt.count ?? "?"})`);
      await sleep(DELAY_MS);
    }
    attributes.push({ name: attr, options: outOptions });
  }

  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(
    OUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        attributes,
        productCount: Object.keys(products).length,
        products,
      },
      null,
      2
    )
  );
  console.log(
    `\nDone. ${attributes.length} attributes, ${Object.keys(products).length} products tagged.`
  );
  console.log(`Written to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
