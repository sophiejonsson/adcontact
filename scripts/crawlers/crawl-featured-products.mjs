import * as cheerio from "cheerio";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CACHE_DIR = join(ROOT, ".cache/adcontact/featured-products");
const OUTPUT_FILE = join(ROOT, "src/data/generated/featured-product-details.json");

const products = [
  ["Mecal TT Press", "tt-press", "/images/tt_web12.jpg"],
  ["Mecal Evolution", "evolution", "/images/evs00_web3.jpg"],
  ["Stripping machine AI 01", "skalmaskin-ai-01", "/images/ai_01-os_1fb4782275.png"],
  ["Ulmer Universal cutting machine SM 15 2PLC", "ulmer-universal-cutting-machine-sm-15-2plc", "/images/sm15_2plc_web.jpg"],
  ["Branson Ultraweld L20 Spot Welder", "branson-ultraweld-l20-spot-welder", "/images/spot_welder.jpg"],
  ["HDP24-24-18SE-L017", "hdp24-24-18se-l017", "/images/no_photo_37.jpg"],
  ["776533-3", "776533-3", "/images/776533-3.jpg"],
  ["1062-12-0144", "1062-12-0144", "/images/1062-12-0144.jpg"],
  ["491116", "491116", "/images/AEI_isoliert_114.jpg"],
  ["J08T6B3 - terminal contacts with 6 position", "j08t6b3-terminal-contacts-with-6-position", "/images/j08t6b3__2_.jpg"],
  ["FHN0-C0A5-C0A5 - Fuse Holder", "fhn0-c0a5-c0a5-fuse-holder", "/images/portafusibili.jpg"],
  ["08MA3A1Z - M8 connectors, 90° with PVC moulded cable", "08ma3a1z-m8-connectors-90-with-pvc-moulded-cable", "/images/08ma3c1z.jpg"],
  ["38712c.60", "38712c-60", "/images/Rb01c2_f3_3.jpg"],
].map(([name, slug, imageUrl]) => ({
  name,
  slug,
  imageUrl,
  sourcePath: `/webshop/${slug}.html`,
  sourceUrl: `https://www.adcontact.se/webshop/${slug}.html`,
}));

const localGalleryImages = {
  evolution: ["/images/evs00_web3.jpg", "/images/evf00_web2.jpg"],
  "ulmer-universal-cutting-machine-sm-15-2plc": [
    "/images/sm15_2plc_web.jpg",
    "/images/sm15_2plc_detail_2_web.jpg",
  ],
  "branson-ultraweld-l20-spot-welder": [
    "/images/spot_welder.jpg",
    "/images/spot_welder_1.jpg",
  ],
};

function clean(value) {
  return value.replace(/\u00a0|В /g, " ").replace(/\s+/g, " ").trim();
}

function localPath(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url, "https://www.adcontact.se");
    return parsed.hostname === "www.adcontact.se"
      ? `${parsed.pathname}${parsed.search}`
      : parsed.toString();
  } catch {
    return url;
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
        url: localPath(url),
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

function cleanContentHtml($, element) {
  const content = element.clone();
  content.find("script, style, iframe, form").remove();
  content.find("*").each((_, node) => {
    const item = $(node);
    for (const attribute of Object.keys(node.attribs ?? {})) {
      if (!["href", "target", "rel"].includes(attribute)) item.removeAttr(attribute);
    }
    if (item.is("a")) {
      item.attr("href", localPath(item.attr("href")));
      if (item.attr("target") === "_blank") item.attr("rel", "noopener noreferrer");
    }
  });
  return content.html()?.trim() ?? "";
}

function parseProduct(html, expected) {
  const $ = cheerio.load(html);
  const heading = clean($(".product-view .product-name h1").first().text()) || expected.name;
  const availabilityNote =
    clean($(".product-type-data .availability span").first().text()) ||
    "Contact us for availability";
  const priceText = clean($(".product-type-data .price").first().text());
  const quoteOnly = $(".product-type-data .btn-cart").text().toLowerCase().includes("quote");
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
        url: new URL(link.attr("href"), "https://www.adcontact.se").toString(),
        ...(sizeMatch ? { size: sizeMatch[1] } : {}),
      });
    });

  const descriptionPanel = panelAfter($, "description");
  const descriptionRoot = descriptionPanel.find(".std").first();
  const shortDescriptionRoot = $(".product-shop .short-description .std").first();

  return {
    name: heading,
    slug: expected.slug,
    sourcePath: expected.sourcePath,
    sourceUrl: expected.sourceUrl,
    imageUrl: expected.imageUrl,
    gallery: localGalleryImages[expected.slug] ?? [expected.imageUrl],
    shortDescription: clean(shortDescriptionRoot.text()),
    descriptionHtml: cleanContentHtml($, descriptionRoot),
    availability: /in stock/i.test(availabilityNote) ? "in-stock" : "lead-time",
    availabilityNote,
    price: quoteOnly || !priceText || priceText === "1" ? "Quote" : priceText,
    specs,
    contacts: parseRelated($, "contacts"),
    matingConnectors: parseRelated($, "matingconectors"),
    requiredComponents: parseRelated($, "required_components"),
    accessories: parseRelated($, "accessories"),
    drawings,
  };
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
      return await response.text();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
}

async function getHtml(product) {
  const cacheFile = join(CACHE_DIR, `${product.slug}.html`);
  try {
    return await readFile(cacheFile, "utf8");
  } catch {
    const html = await fetchWithRetry(product.sourceUrl);
    await writeFile(cacheFile, html);
    return html;
  }
}

await mkdir(CACHE_DIR, { recursive: true });
const output = [];

for (const [index, product] of products.entries()) {
  process.stdout.write(`[${index + 1}/${products.length}] ${product.name} ... `);
  const parsed = parseProduct(await getHtml(product), product);
  output.push(parsed);
  console.log(`ok (${Object.keys(parsed.specs).length} specs)`);
}

await writeFile(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${output.length} featured product pages.`);
