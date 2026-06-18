import * as cheerio from "cheerio";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SOURCE_FILE = join(ROOT, "src/data/deutschConnectors.ts");
const CACHE_DIR = join(ROOT, ".cache/adcontact/deutsch");
const IMAGE_DIR = join(ROOT, "public/images/products/deutsch");
const GENERATED_DIR = join(ROOT, "src/data/generated");
const GENERATED_PRODUCTS_FILE = join(GENERATED_DIR, "deutsch-products.json");
const BASE_URL = "https://www.adcontact.se/webshop/";
const DELAY_MS = Number(process.env.CRAWL_DELAY_MS ?? 350);
const RETRIES = 4;
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
const skipImages = process.argv.includes("--skip-images");

function clean(value) {
  return value.replace(/\u00a0|В /g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseCatalogue(source) {
  const products = [];
  const rowPattern =
    /^\s*\{\s*partNumber:\s*"([^"]+)",\s*series:\s*"([^"]+)",\s*ways:\s*(null|\d+),\s*type:\s*(null|"Plug"|"Socket"),\s*availability:\s*"(quote|lead-time)",\s*imageUrl:\s*(null|"[^"]*"),\s*urlPath:\s*"([^"]+)"\s*\},?\s*$/;

  for (const line of source.split("\n")) {
    const match = line.match(rowPattern);
    if (!match) continue;
    products.push({
      partNumber: match[1],
      series: match[2],
      ways: match[3] === "null" ? null : Number(match[3]),
      type: match[4] === "null" ? null : match[4].slice(1, -1),
      availability: match[5],
      imageUrl: match[6] === "null" ? null : match[6].slice(1, -1),
      urlPath: match[7],
    });
  }

  if (products.length < 100) {
    throw new Error(`Only parsed ${products.length} catalogue products; source format may have changed.`);
  }
  return products;
}

async function readCatalogue() {
  try {
    return JSON.parse(await readFile(GENERATED_PRODUCTS_FILE, "utf8"));
  } catch {
    return parseCatalogue(await readFile(SOURCE_FILE, "utf8"));
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
      if (!partNumber) return;
      items.push({
        partNumber,
        imageUrl: item.find("a.product-image img").first().attr("src") || null,
        url: link.attr("href") || undefined,
      });
    });
  return items;
}

function drawingType(label, imageUrl) {
  const value = `${label} ${imageUrl}`.toLowerCase();
  if (value.includes("step")) return "step";
  if (value.includes("iges")) return "iges";
  if (value.includes("dxf")) return "dxf";
  if (value.includes("tif")) return "tif";
  if (value.includes("jpeg") || value.includes("jpg")) return "tif";
  if (value.includes("pdf")) return "pdf";
  return "zip";
}

function parseProduct(html, expectedProduct) {
  const $ = cheerio.load(html);
  const partNumber = clean($(".product-view .product-name h1").first().text());
  if (!partNumber) throw new Error("Page did not contain a product heading.");
  if (partNumber.toLowerCase() !== expectedProduct.partNumber.toLowerCase()) {
    throw new Error(`Expected ${expectedProduct.partNumber}, received ${partNumber}.`);
  }

  const mainImage = $(".product-img-column .product-image img").first();
  const largeImage = $(".product-img-column .product-image a").first().attr("href");
  const imageUrl = mainImage.attr("src") || largeImage || expectedProduct.imageUrl;
  const availabilityNote =
    clean($(".product-type-data .availability span").first().text()) || "Contact us for availability";
  const specs = {};

  $("#product-attribute-specs-table tr").each((_, row) => {
    const label = clean($(row).find("th.label").text()).replace(/^\s+/, "");
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

  return {
    partNumber,
    slug: slugify(partNumber),
    imageUrl,
    largImageUrl: largeImage || imageUrl,
    availability: /estimated delivery/i.test(availabilityNote)
      ? "lead-time"
      : expectedProduct.availability,
    availabilityNote,
    specs,
    contacts: parseRelated($, "contacts"),
    matingConnectors: parseRelated($, "matingconectors"),
    requiredComponents: parseRelated($, "required_components"),
    accessories: parseRelated($, "accessories"),
    drawings,
  };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url) {
  let lastError;
  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Adcontact site migration crawler (info@adcontact.se)" },
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < RETRIES) await sleep(750 * attempt);
    }
  }
  throw lastError;
}

async function getHtml(product) {
  const cachePath = join(CACHE_DIR, `${slugify(product.partNumber)}.html`);
  try {
    return await readFile(cachePath, "utf8");
  } catch {
    const response = await fetchWithRetry(new URL(product.urlPath, BASE_URL));
    const html = await response.text();
    await writeFile(cachePath, html);
    await sleep(DELAY_MS);
    return html;
  }
}

function imageExtension(url, contentType) {
  const urlExtension = extname(new URL(url).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(urlExtension)) return urlExtension;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

async function localizeImage(detail) {
  if (skipImages || !detail.largImageUrl) return detail;
  const sourceExtension = extname(new URL(detail.largImageUrl).pathname).toLowerCase();
  const expectedExtension = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(sourceExtension)
    ? sourceExtension
    : ".jpg";
  const expectedFilename = `${detail.slug}${expectedExtension}`;
  try {
    await access(join(IMAGE_DIR, expectedFilename));
    const localUrl = `/images/products/deutsch/${expectedFilename}`;
    return { ...detail, imageUrl: localUrl, largImageUrl: localUrl };
  } catch {
    // Download below when the local asset does not exist yet.
  }
  const response = await fetchWithRetry(detail.largImageUrl);
  const extension = imageExtension(
    detail.largImageUrl,
    response.headers.get("content-type") || "",
  );
  const filename = `${detail.slug}${extension}`;
  await writeFile(join(IMAGE_DIR, filename), Buffer.from(await response.arrayBuffer()));
  const localUrl = `/images/products/deutsch/${filename}`;
  return { ...detail, imageUrl: localUrl, largImageUrl: localUrl };
}

async function main() {
  await Promise.all([
    mkdir(CACHE_DIR, { recursive: true }),
    mkdir(IMAGE_DIR, { recursive: true }),
    mkdir(GENERATED_DIR, { recursive: true }),
  ]);

  const catalogue = await readCatalogue();
  const selected = catalogue.slice(0, LIMIT);
  const details = [];
  const failures = [];

  for (const [index, product] of selected.entries()) {
    process.stdout.write(`[${index + 1}/${selected.length}] ${product.partNumber} ... `);
    try {
      const detail = await localizeImage(parseProduct(await getHtml(product), product));
      details.push(detail);
      product.imageUrl = detail.imageUrl;
      product.availability = detail.availability;
      console.log(`ok (${Object.keys(detail.specs).length} specs)`);
    } catch (error) {
      failures.push({ partNumber: product.partNumber, error: error.message });
      console.log(`failed: ${error.message}`);
    }
  }

  if (LIMIT === Infinity) {
    await writeFile(
      GENERATED_PRODUCTS_FILE,
      `${JSON.stringify(catalogue, null, 2)}\n`,
    );
    await writeFile(
      join(GENERATED_DIR, "deutsch-product-details.json"),
      `${JSON.stringify(details, null, 2)}\n`,
    );
    await writeFile(
      join(GENERATED_DIR, "deutsch-crawl-report.json"),
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          catalogueCount: catalogue.length,
          detailCount: details.length,
          failures,
          checksum: createHash("sha256")
            .update(JSON.stringify(details))
            .digest("hex"),
        },
        null,
        2,
      )}\n`,
    );
  }

  console.log(`\nParsed ${details.length}/${selected.length} products.`);
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  }
}

await main();
