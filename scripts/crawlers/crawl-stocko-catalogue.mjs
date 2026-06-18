// Crawl the full Stocko catalogue (category tree + products) from the legacy
// storefront so we can render native, on-brand category and listing pages.
//
//   node scripts/crawlers/crawl-stocko-catalogue.mjs
//
// Output: src/data/generated/stocko-catalogue.json
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

const BRAND = arg("brand", "stocko");
const OUT_FILE = join(GENERATED_DIR, arg("out", `${BRAND}-catalogue.json`));

const ORIGIN = "https://www.adcontact.se";
const STOCKO_PREFIX = `/webshop/components/sealed-connectors/${BRAND}`;
const DELAY_MS = Number(process.env.CRAWL_DELAY_MS ?? 250);
const RETRIES = 4;

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

/** path = part after "/<brand>/" with ".html" stripped, e.g. "crimp-contacts/receptacles". */
const PATH_RE = new RegExp(`/${BRAND}/(.+?)\\.html(?:[?#]|$)`);
function toPath(href) {
  const m = href.match(PATH_RE);
  return m ? m[1] : null;
}

// 1. Build the full category tree from the left-nav menu (one page exposes all
//    branches). We union a few pages to be safe.
async function buildTree() {
  const nodes = new Map(); // path -> { path, title, children:[], products:[] }

  function harvest($) {
    // Category links live in the nav as <li class="levelN"><a><span>label</span></a>,
    // and (for image-tile brands) as category tiles in the main content.
    $(`a[href*="/${BRAND}/"]`).each((_, a) => {
      const inNav = $(a).closest('li[class*="level"]').length > 0;
      const inTile = $(a).closest(".category-products-grid, .item, .nav-regular, .category-image, .itemgrid").length > 0;
      if (!inNav && !inTile) return;
      const href = $(a).attr("href") || "";
      const path = toPath(href);
      if (!path) return;
      const title =
        clean($(a).find("span").first().text()) ||
        clean($(a).attr("title")) ||
        clean($(a).text());
      const existing = nodes.get(path);
      if (existing) {
        if (!existing.title && title) existing.title = title;
      } else {
        nodes.set(path, { path, title, children: [], products: [] });
      }
    });
  }

  // Seed from the brand root, then expand each discovered top-level category.
  const root = `${ORIGIN}${STOCKO_PREFIX}.html`;
  try {
    harvest(cheerio.load(await fetchHtml(root)));
  } catch {
    /* ignore */
  }
  const topLevel = [...nodes.keys()].filter((p) => !p.includes("/"));
  for (const top of topLevel) {
    await sleep(DELAY_MS);
    try {
      harvest(cheerio.load(await fetchHtml(`${ORIGIN}${STOCKO_PREFIX}/${top}.html`)));
    } catch {
      /* ignore */
    }
  }

  // Wire up parent/child relationships based on path nesting.
  for (const path of nodes.keys()) {
    const idx = path.lastIndexOf("/");
    if (idx === -1) continue;
    const parent = path.slice(0, idx);
    if (nodes.has(parent)) nodes.get(parent).children.push(path);
  }
  for (const n of nodes.values()) {
    n.children.sort();
    n.parent = n.path.includes("/") ? n.path.slice(0, n.path.lastIndexOf("/")) : null;
  }
  return nodes;
}

// 2. Parse products from a listing page (with pagination).
function parseProducts($) {
  const products = [];
  $(".products-grid li.item").each((_, li) => {
    const $li = $(li);
    const $img = $li.find("a.product-image").first();
    const $name = $li.find("h2.product-name a").first();
    const href = $name.attr("href") || $img.attr("href") || "";
    const path = toPath(href);
    const name = clean($name.attr("title")) || clean($name.text());
    const image = $li.find("a.product-image img").first().attr("src") || null;
    if (!name || !path) return;
    products.push({ partNumber: name, path, image });
  });
  return products;
}

async function crawlProducts(node) {
  const baseUrl = `${ORIGIN}${STOCKO_PREFIX}/${node.path}.html`;
  let html;
  try {
    html = await fetchHtml(baseUrl);
  } catch {
    return [];
  }
  let $ = cheerio.load(html);
  const products = parseProducts($);
  if (products.length === 0) return [];

  // Pagination: gather max ?p=N from the pager.
  const pageNums = new Set();
  $('a[href*="?p="], a[href*="&p="]').each((_, a) => {
    const m = ($(a).attr("href") || "").match(/[?&]p=(\d+)/);
    if (m) pageNums.add(Number(m[1]));
  });
  const maxPage = pageNums.size ? Math.max(...pageNums) : 1;

  const seen = new Set(products.map((p) => p.path));
  for (let p = 2; p <= maxPage; p += 1) {
    await sleep(DELAY_MS);
    try {
      $ = cheerio.load(await fetchHtml(`${baseUrl}?p=${p}`));
    } catch {
      continue;
    }
    for (const prod of parseProducts($)) {
      if (!seen.has(prod.path)) {
        seen.add(prod.path);
        products.push(prod);
      }
    }
  }
  return products;
}

async function main() {
  console.log("Building Stocko category tree…");
  const nodes = await buildTree();
  console.log(`  ${nodes.size} category nodes found.`);

  // Crawl products on every node (mid-level pages simply return none).
  const list = [...nodes.values()];
  let withProducts = 0;
  let total = 0;
  for (let i = 0; i < list.length; i += 1) {
    const node = list[i];
    const products = await crawlProducts(node);
    node.products = products;
    if (products.length) {
      withProducts += 1;
      total += products.length;
    }
    console.log(
      `  [${i + 1}/${list.length}] ${node.path} — ${products.length} products`
    );
    await sleep(DELAY_MS);
  }

  const roots = list.filter((n) => !n.parent).map((n) => n.path).sort();
  const nodeObj = {};
  for (const n of list) nodeObj[n.path] = n;

  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(
    OUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        roots,
        nodeCount: list.length,
        productCount: total,
        nodes: nodeObj,
      },
      null,
      2
    )
  );

  console.log(
    `\nDone. ${list.length} categories, ${withProducts} with products, ${total} products total.`
  );
  console.log(`Written to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
