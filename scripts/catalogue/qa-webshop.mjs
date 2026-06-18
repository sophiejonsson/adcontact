import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as cheerio from "cheerio";

const root = process.cwd();
const routesPath = path.join(root, "src/data/generated/magento-catalogue/routes.json");
const reportPath = path.join(root, "src/data/generated/magento-catalogue/qa-report.json");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const baseUrl = args.get("base") ?? "http://localhost:3012";
const productLimit = Number(args.get("product-limit") ?? 1500);
const concurrency = Number(args.get("concurrency") ?? 12);
const assetLimit = Number(args.get("asset-limit") ?? 3000);
const allProducts = args.get("all-products") === "true";
const checkDiscoveredLinks = args.get("check-links") !== "false";
const checkAssets = args.get("check-assets") !== "false";
const checkOldDomain = args.get("check-old-domain") !== "false";

function unique(values) {
  return [...new Set(values)];
}

function absolutize(url) {
  if (!url || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) return null;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return null;
  }
}

async function fetchStatus(url, { readHtml = true } = {}) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      return {
        url,
        status: response.status,
        location: response.headers.get("location"),
        contentType: response.headers.get("content-type"),
        ok: response.status >= 200 && response.status < 400,
        html:
          readHtml && response.headers.get("content-type")?.includes("text/html")
            ? await response.text()
            : null,
      };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  return {
    url,
    status: 0,
    ok: false,
    error: lastError instanceof Error ? lastError.message : String(lastError),
    html: null,
  };
}

async function mapConcurrent(items, limit, mapper) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function pickProductRoutes(productRoutes) {
  if (allProducts || productRoutes.length <= productLimit) return productRoutes;
  const selected = new Set();
  const step = productRoutes.length / productLimit;
  for (let index = 0; index < productLimit; index += 1) {
    selected.add(productRoutes[Math.floor(index * step)]);
  }
  return [...selected];
}

const routes = JSON.parse(await fs.readFile(routesPath, "utf8"));
const entries = Object.entries(routes).filter(([route]) => route.startsWith("/webshop"));
const categoryRoutes = entries
  .filter(([, value]) => value.type === "category")
  .map(([route]) => route)
  .sort();
const productRoutes = entries
  .filter(([, value]) => value.type === "product")
  .map(([route]) => route)
  .sort();
const checkedRoutes = unique(["/webshop.html", ...categoryRoutes, ...pickProductRoutes(productRoutes)]);

console.log(`QA base: ${baseUrl}`);
console.log(`Checking ${checkedRoutes.length} pages (${categoryRoutes.length} categories, ${checkedRoutes.length - categoryRoutes.length - 1} products)`);

const pageResults = await mapConcurrent(checkedRoutes, concurrency, async (route, index) => {
  if (index > 0 && index % 500 === 0) console.log(`Checked ${index}/${checkedRoutes.length} pages...`);
  const result = await fetchStatus(absolutize(route), {
    readHtml: checkOldDomain || checkDiscoveredLinks || checkAssets,
  });
  return { route, ...result };
});

const brokenPages = pageResults.filter((page) => !page.ok);
const oldDomainAnchors = [];
const internalLinks = [];
const assets = [];

for (const page of pageResults) {
  if (!page.html) continue;
  const $ = cheerio.load(page.html);
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;
    if (checkOldDomain && /^https?:\/\/(?:www\.)?adcontact\.se\//i.test(href)) {
      oldDomainAnchors.push({ route: page.route, href });
    }
    const absolute = absolutize(href);
    if (!absolute) return;
    const parsed = new URL(absolute);
    if (parsed.origin === new URL(baseUrl).origin && (parsed.pathname.startsWith("/webshop") || parsed.pathname.startsWith("/amfilerating"))) {
      internalLinks.push(parsed.pathname + parsed.search);
    }
  });
  $("img[src]").each((_, element) => {
    const src = $(element).attr("src");
    const absolute = absolutize(src);
    if (absolute) assets.push(absolute);
  });
}

const uniqueInternalLinks = checkDiscoveredLinks ? unique(internalLinks) : [];
if (checkDiscoveredLinks) console.log(`Checking ${uniqueInternalLinks.length} discovered internal links...`);
const internalLinkResults = checkDiscoveredLinks
  ? await mapConcurrent(uniqueInternalLinks, concurrency, async (link) => {
      const result = await fetchStatus(absolutize(link));
      return { link, ...result, html: undefined };
    })
  : [];
const brokenInternalLinks = internalLinkResults.filter((link) => !link.ok);

const sampledAssets = checkAssets ? unique(assets).slice(0, assetLimit) : [];
if (checkAssets) console.log(`Checking ${sampledAssets.length} image assets...`);
const assetResults = checkAssets
  ? await mapConcurrent(sampledAssets, concurrency, async (asset) => {
      const result = await fetchStatus(asset);
      return { asset, ...result, html: undefined };
    })
  : [];
const brokenAssets = assetResults.filter((asset) => !asset.ok);

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  routeTotals: {
    categories: categoryRoutes.length,
    products: productRoutes.length,
    checkedPages: checkedRoutes.length,
    checkedAssets: sampledAssets.length,
  },
  failures: {
    brokenPages: brokenPages.slice(0, 200),
    oldDomainAnchors: oldDomainAnchors.slice(0, 200),
    brokenInternalLinks: brokenInternalLinks.slice(0, 200),
    brokenAssets: brokenAssets.slice(0, 200),
  },
  counts: {
    brokenPages: brokenPages.length,
    oldDomainAnchors: oldDomainAnchors.length,
    brokenInternalLinks: brokenInternalLinks.length,
    brokenAssets: brokenAssets.length,
  },
};

await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Report: ${path.relative(root, reportPath)}`);
console.log(JSON.stringify(report.counts, null, 2));
