import * as cheerio from "cheerio";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DETAILS_FILE = join(ROOT, "src/data/generated/deutsch-product-details.json");
const CATALOGUE_FILE = join(ROOT, "src/data/generated/deutsch-products.json");
const OUTPUT_FILE = join(ROOT, "src/data/generated/related-products.json");
const REPORT_FILE = join(ROOT, "src/data/generated/related-products-report.json");
const CACHE_DIR = join(ROOT, ".cache/adcontact/related-products");
const IMAGE_DIR = join(ROOT, "public/images/products/related");
const DELAY_MS = Number(process.env.CRAWL_DELAY_MS ?? 300);
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

function clean(value) {
  return value.replace(/\u00a0|В /g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function localPath(url) {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
}

function productKey(url) {
  return new URL(url).pathname.replace(/\/$/, "").toLowerCase();
}

function isProductUrl(url) {
  try {
    const path = new URL(url).pathname;
    return path.startsWith("/catalog/product/view/") || path.startsWith("/webshop/");
  } catch {
    return false;
  }
}

function panelAfter($, id) {
  return $(`[id="acctab-${id}"]`).next(".panel");
}

function parseRelated($, id) {
  const items = [];
  panelAfter($, id)
    .find(".mobile-grid")
    .each((_, element) => {
      const item = $(element);
      const link = item.find("h2.product-name a").first();
      const partNumber = clean(link.attr("title") || link.text());
      const url = link.attr("href");
      if (!partNumber || !url) return;
      items.push({
        partNumber,
        imageUrl: item.find("a.product-image img").first().attr("src") || null,
        url,
      });
    });
  return items;
}

function drawingType(label, imageUrl) {
  const value = `${label} ${imageUrl}`.toLowerCase();
  if (value.includes("step")) return "step";
  if (value.includes("iges")) return "iges";
  if (value.includes("dxf")) return "dxf";
  if (value.includes("tif") || value.includes("jpeg") || value.includes("jpg")) return "tif";
  if (value.includes("pdf")) return "pdf";
  return "zip";
}

function parseProduct(html, expected) {
  const $ = cheerio.load(html);
  const partNumber = clean($(".product-view .product-name h1").first().text());
  if (!partNumber) throw new Error("Page did not contain a product heading.");

  const mainImage = $(".product-img-column .product-image img").first();
  const largeImage = $(".product-img-column .product-image a").first().attr("href");
  const imageUrl = mainImage.attr("src") || largeImage || expected.imageUrl;
  const availabilityNote =
    clean($(".product-type-data .availability span").first().text()) ||
    "Contact us for availability";
  const specs = {};

  $("#product-attribute-specs-table tr").each((_, row) => {
    const label = clean($(row).find("th.label").text());
    const value = clean($(row).find("td.data").text());
    if (label && value && label !== "Page Layout" && label !== "Country of Manufacture") {
      specs[label] = value;
    }
  });

  const drawings = [];
  panelAfter($, "amfile.files")
    .find("a.file")
    .each((_, element) => {
      const link = $(element);
      const rawLabel = clean(link.find("span").text());
      const sizeMatch = rawLabel.match(/\(([\d.]+\s+(?:KB|MB))\)\s*$/i);
      const label = clean(rawLabel.replace(/\s*\([\d.]+\s+(?:KB|MB)\)\s*$/i, ""));
      drawings.push({
        label,
        type: drawingType(label, link.find("img").attr("src") || ""),
        url: link.attr("href"),
        ...(sizeMatch ? { size: sizeMatch[1] } : {}),
      });
    });

  const related = {
    contacts: parseRelated($, "contacts"),
    matingConnectors: parseRelated($, "matingconectors"),
    requiredComponents: parseRelated($, "required_components"),
    accessories: parseRelated($, "accessories"),
  };

  return {
    partNumber,
    slug: slugify(partNumber),
    sourcePath: localPath(expected.url),
    sourceUrl: expected.url,
    imageUrl,
    largeImageUrl: largeImage || imageUrl,
    availability: /in stock/i.test(availabilityNote) ? "in-stock" : "lead-time",
    availabilityNote,
    specs,
    ...related,
    drawings,
  };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Adcontact site migration crawler (info@adcontact.se)" },
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 4) await sleep(750 * attempt);
    }
  }
  throw lastError;
}

async function getHtml(item) {
  const cachePath = join(CACHE_DIR, `${slugify(item.partNumber)}.html`);
  try {
    return await readFile(cachePath, "utf8");
  } catch {
    const response = await fetchWithRetry(item.url);
    const html = await response.text();
    await writeFile(cachePath, html);
    await sleep(DELAY_MS);
    return html;
  }
}

function imageExtension(url, contentType) {
  const extension = extname(new URL(url).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) return extension;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

async function localizeImage(product) {
  if (!product.largeImageUrl) return product;
  const sourceExtension = extname(new URL(product.largeImageUrl).pathname).toLowerCase();
  const expectedExtension = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(sourceExtension)
    ? sourceExtension
    : ".jpg";
  const expectedFile = join(IMAGE_DIR, `${product.slug}${expectedExtension}`);

  try {
    await access(expectedFile);
    const url = `/images/products/related/${product.slug}${expectedExtension}`;
    return { ...product, imageUrl: url, largeImageUrl: url };
  } catch {
    const response = await fetchWithRetry(product.largeImageUrl);
    const extension = imageExtension(
      product.largeImageUrl,
      response.headers.get("content-type") || "",
    );
    const filename = `${product.slug}${extension}`;
    await writeFile(join(IMAGE_DIR, filename), Buffer.from(await response.arrayBuffer()));
    const url = `/images/products/related/${filename}`;
    return { ...product, imageUrl: url, largeImageUrl: url };
  }
}

async function main() {
  await Promise.all([
    mkdir(CACHE_DIR, { recursive: true }),
    mkdir(IMAGE_DIR, { recursive: true }),
  ]);

  const details = JSON.parse(await readFile(DETAILS_FILE, "utf8"));
  const catalogue = JSON.parse(await readFile(CATALOGUE_FILE, "utf8"));
  const migratedParts = new Set(catalogue.map((product) => product.partNumber.toLowerCase()));
  const migratedPaths = new Set(
    catalogue.map((product) => `/webshop/${product.urlPath}`.toLowerCase()),
  );
  const queue = [];
  const queued = new Set();

  function enqueue(item) {
    if (!item.url || !isProductUrl(item.url)) return;
    const key = productKey(item.url);
    if (migratedParts.has(item.partNumber.toLowerCase()) || migratedPaths.has(key) || queued.has(key)) {
      return;
    }
    queued.add(key);
    queue.push(item);
  }

  for (const detail of details) {
    for (const item of [
      ...detail.contacts,
      ...detail.matingConnectors,
      ...detail.requiredComponents,
      ...detail.accessories,
    ]) {
      enqueue(item);
    }
  }

  const products = [];
  const failures = [];
  let index = 0;

  while (index < queue.length && products.length < LIMIT) {
    const item = queue[index];
    index += 1;
    process.stdout.write(`[${index}/${queue.length}] ${item.partNumber} ... `);
    try {
      const product = await localizeImage(parseProduct(await getHtml(item), item));
      products.push(product);
      for (const related of [
        ...product.contacts,
        ...product.matingConnectors,
        ...product.requiredComponents,
        ...product.accessories,
      ]) {
        enqueue(related);
      }
      console.log(`ok (${Object.keys(product.specs).length} specs)`);
    } catch (error) {
      failures.push({ partNumber: item.partNumber, url: item.url, error: error.message });
      console.log(`failed: ${error.message}`);
    }
  }

  if (LIMIT === Infinity) {
    await writeFile(OUTPUT_FILE, `${JSON.stringify(products, null, 2)}\n`);
    await writeFile(
      REPORT_FILE,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          productCount: products.length,
          discoveredCount: queue.length,
          failures,
        },
        null,
        2,
      )}\n`,
    );
  }

  console.log(`\nParsed ${products.length}/${Math.min(queue.length, LIMIT)} products.`);
  if (failures.length) process.exitCode = 1;
}

await main();
