// Export the legacy Magento catalogue into a clean, route-first JSON model.
//
// Usage:
//   MAGENTO_DB=adcgamhe_adcgamweb node scripts/catalogue/export-magento-catalogue.mjs
//
// Optional:
//   MAGENTO_SOCKET=/tmp/adcontact-mariadb.sock
//   MAGENTO_USER=root
//   MAGENTO_OUT_DIR=src/data/generated/magento-catalogue
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DB = process.env.MAGENTO_DB ?? "adcgamhe_adcgamweb";
const OUT_DIR = join(
  ROOT,
  process.env.MAGENTO_OUT_DIR ?? "src/data/generated/magento-catalogue",
);
const MEDIA_BASE_PATH = process.env.MAGENTO_MEDIA_BASE_PATH ?? "/media/catalog/product";
const FILE_BASE_PATH = process.env.MAGENTO_FILE_BASE_PATH ?? "/media/amfile/files";

const CORE_PRODUCT_ATTRIBUTES = new Set([
  "category_ids",
  "created_at",
  "custom_design",
  "custom_design_from",
  "custom_design_to",
  "custom_layout_update",
  "description",
  "gallery",
  "gift_message_available",
  "image",
  "is_recurring",
  "manufacturer",
  "media_gallery",
  "meta_description",
  "meta_keyword",
  "meta_title",
  "msrp",
  "msrp_display_actual_price_type",
  "msrp_enabled",
  "name",
  "news_from_date",
  "news_to_date",
  "options_container",
  "price",
  "purchase_currency",
  "required_options",
  "short_description",
  "sku",
  "small_image",
  "special_price",
  "status",
  "tax_class_id",
  "thumbnail",
  "type_id",
  "updated_at",
  "url_key",
  "url_path",
  "visibility",
  "weight",
]);

function mysqlArgs(query) {
  const args = ["--batch", "--skip-column-names"];
  if (process.env.MAGENTO_SOCKET) args.push(`--socket=${process.env.MAGENTO_SOCKET}`);
  if (process.env.MAGENTO_HOST) args.push("-h", process.env.MAGENTO_HOST);
  if (process.env.MAGENTO_PORT) args.push("-P", process.env.MAGENTO_PORT);
  if (process.env.MAGENTO_USER) args.push("-u", process.env.MAGENTO_USER);
  if (process.env.MAGENTO_PASSWORD) args.push(`--password=${process.env.MAGENTO_PASSWORD}`);
  args.push("-D", DB, "-e", query);
  return args;
}

function query(sql) {
  const output = execFileSync("mariadb", mysqlArgs(sql), {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 256,
  });
  if (!output.trim()) return [];
  return output
    .replace(/\n$/, "")
    .split("\n")
    .map((line) => line.split("\t").map(parseCell));
}

function parseCell(value) {
  if (value === "NULL") return null;
  return value
    .replace(/\\0/g, "\0")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

function clean(value) {
  if (value == null) return null;
  const out = String(value).replace(/\s+/g, " ").trim();
  return out || null;
}

function cleanLabel(value) {
  const out = clean(value)?.replace(/В\s*/g, " ").replace(/\s+/g, " ").trim();
  return out || null;
}

function cleanHtml(value) {
  if (value == null) return null;
  const out = String(value).replace(/\r\n/g, "\n").trim();
  return out || null;
}

function normalizePath(path) {
  if (!path) return null;
  return String(path).replace(/^\/+/, "").replace(/\/+/g, "/");
}

function mediaPath(value) {
  const path = normalizePath(value);
  if (!path || path === "no_selection") return null;
  return `${MEDIA_BASE_PATH}/${path}`;
}

function filePath(value) {
  const path = normalizePath(value);
  if (!path) return null;
  return `${FILE_BASE_PATH}/${path}`;
}

function optionIds(value) {
  const cleaned = clean(value);
  if (!cleaned || !/^\d+(,\d+)*$/.test(cleaned)) return null;
  return cleaned.split(",");
}

function resolveOptionValue(attributeId, value, optionLabels) {
  const ids = optionIds(value);
  if (!ids) return clean(value);

  const labels = ids.map((id) => optionLabels.get(`${attributeId}:${id}`));
  if (labels.every(Boolean)) return labels.join(", ");

  return clean(value);
}

function routeKey(path) {
  const cleanPath = normalizePath(path);
  return cleanPath ? `/${cleanPath}` : null;
}

function productUrlFromCategory(categoryPath, productPath) {
  const c = normalizePath(categoryPath);
  const p = normalizePath(productPath);
  if (!c || !p) return null;
  return `${c.replace(/\.html$/, "")}/${p}`;
}

const productRows = query(`
SELECT
  p.entity_id,
  p.sku,
  p.type_id,
  name.value,
  url_path.value,
  image.value,
  small_image.value,
  thumbnail.value,
  description.value,
  short_description.value,
  meta_title.value,
  meta_description.value,
  price.value,
  special_price.value,
  status.value,
  visibility.value,
  manufacturer.value,
  manufacturer_label.value,
  brand.value
FROM catalog_product_entity p
LEFT JOIN catalog_product_entity_varchar name ON name.entity_id=p.entity_id AND name.attribute_id=71 AND name.store_id=0
LEFT JOIN catalog_product_entity_varchar url_path ON url_path.entity_id=p.entity_id AND url_path.attribute_id=98 AND url_path.store_id=0
LEFT JOIN catalog_product_entity_varchar image ON image.entity_id=p.entity_id AND image.attribute_id=85 AND image.store_id=0
LEFT JOIN catalog_product_entity_varchar small_image ON small_image.entity_id=p.entity_id AND small_image.attribute_id=86 AND small_image.store_id=0
LEFT JOIN catalog_product_entity_varchar thumbnail ON thumbnail.entity_id=p.entity_id AND thumbnail.attribute_id=87 AND thumbnail.store_id=0
LEFT JOIN catalog_product_entity_text description ON description.entity_id=p.entity_id AND description.attribute_id=72 AND description.store_id=0
LEFT JOIN catalog_product_entity_text short_description ON short_description.entity_id=p.entity_id AND short_description.attribute_id=73 AND short_description.store_id=0
LEFT JOIN catalog_product_entity_varchar meta_title ON meta_title.entity_id=p.entity_id AND meta_title.attribute_id=82 AND meta_title.store_id=0
LEFT JOIN catalog_product_entity_varchar meta_description ON meta_description.entity_id=p.entity_id AND meta_description.attribute_id=84 AND meta_description.store_id=0
LEFT JOIN catalog_product_entity_decimal price ON price.entity_id=p.entity_id AND price.attribute_id=75 AND price.store_id=0
LEFT JOIN catalog_product_entity_decimal special_price ON special_price.entity_id=p.entity_id AND special_price.attribute_id=76 AND special_price.store_id=0
LEFT JOIN catalog_product_entity_int status ON status.entity_id=p.entity_id AND status.attribute_id=96 AND status.store_id=0
LEFT JOIN catalog_product_entity_int visibility ON visibility.entity_id=p.entity_id AND visibility.attribute_id=102 AND visibility.store_id=0
LEFT JOIN catalog_product_entity_int manufacturer ON manufacturer.entity_id=p.entity_id AND manufacturer.attribute_id=81 AND manufacturer.store_id=0
LEFT JOIN eav_attribute_option_value manufacturer_label ON manufacturer_label.option_id=manufacturer.value AND manufacturer_label.store_id=0
LEFT JOIN catalog_product_entity_varchar brand ON brand.entity_id=p.entity_id AND brand.attribute_id=264 AND brand.store_id=0
ORDER BY p.entity_id;
`);

const categoryRows = query(`
SELECT
  c.entity_id,
  c.parent_id,
  c.path,
  c.position,
  c.level,
  name.value,
  url_path.value,
  image.value,
  description.value,
  meta_title.value,
  meta_description.value,
  is_active.value,
  include_in_menu.value
FROM catalog_category_entity c
LEFT JOIN catalog_category_entity_varchar name ON name.entity_id=c.entity_id AND name.attribute_id=41 AND name.store_id=0
LEFT JOIN catalog_category_entity_varchar url_path ON url_path.entity_id=c.entity_id AND url_path.attribute_id=57 AND url_path.store_id=0
LEFT JOIN catalog_category_entity_varchar image ON image.entity_id=c.entity_id AND image.attribute_id=45 AND image.store_id=0
LEFT JOIN catalog_category_entity_text description ON description.entity_id=c.entity_id AND description.attribute_id=44 AND description.store_id=0
LEFT JOIN catalog_category_entity_varchar meta_title ON meta_title.entity_id=c.entity_id AND meta_title.attribute_id=46 AND meta_title.store_id=0
LEFT JOIN catalog_category_entity_text meta_description ON meta_description.entity_id=c.entity_id AND meta_description.attribute_id=48 AND meta_description.store_id=0
LEFT JOIN catalog_category_entity_int is_active ON is_active.entity_id=c.entity_id AND is_active.attribute_id=42 AND is_active.store_id=0
LEFT JOIN catalog_category_entity_int include_in_menu ON include_in_menu.entity_id=c.entity_id AND include_in_menu.attribute_id=67 AND include_in_menu.store_id=0
ORDER BY c.path;
`);

const productCategoryRows = query(`
SELECT product_id, category_id, position
FROM catalog_category_product
ORDER BY product_id, position, category_id;
`);

const galleryRows = query(`
SELECT entity_id, value
FROM catalog_product_entity_media_gallery
WHERE value IS NOT NULL AND value <> ''
ORDER BY entity_id, value_id;
`);

const fileRows = query(`
SELECT
  f.file_id,
  f.product_id,
  f.file_url,
  f.file_name,
  f.file_link,
  s.label,
  s.position
FROM am_file f
LEFT JOIN am_file_store s ON s.file_id=f.file_id AND s.store_id=0
ORDER BY f.product_id, COALESCE(s.position, 0), f.file_id;
`);

const optionRows = query(`
SELECT o.attribute_id, o.option_id, ov.value
FROM eav_attribute_option o
JOIN eav_attribute a ON a.attribute_id=o.attribute_id
JOIN eav_entity_type t ON t.entity_type_id=a.entity_type_id AND t.entity_type_code='catalog_product'
LEFT JOIN eav_attribute_option_value ov ON ov.option_id=o.option_id AND ov.store_id=0
WHERE ov.value IS NOT NULL AND ov.value <> ''
ORDER BY o.attribute_id, o.sort_order, o.option_id;
`);

const attributeRows = query(`
SELECT entity_id, attribute_id, attribute_code, frontend_label, value FROM (
  SELECT v.entity_id, a.attribute_id, a.attribute_code, a.frontend_label, CAST(v.value AS CHAR) AS value
  FROM catalog_product_entity_varchar v
  JOIN eav_attribute a ON a.attribute_id=v.attribute_id
  JOIN eav_entity_type t ON t.entity_type_id=a.entity_type_id AND t.entity_type_code='catalog_product'
  WHERE v.store_id=0 AND v.value IS NOT NULL AND v.value <> ''
  UNION ALL
  SELECT v.entity_id, a.attribute_id, a.attribute_code, a.frontend_label, CAST(v.value AS CHAR) AS value
  FROM catalog_product_entity_text v
  JOIN eav_attribute a ON a.attribute_id=v.attribute_id
  JOIN eav_entity_type t ON t.entity_type_id=a.entity_type_id AND t.entity_type_code='catalog_product'
  WHERE v.store_id=0 AND v.value IS NOT NULL AND v.value <> ''
  UNION ALL
  SELECT v.entity_id, a.attribute_id, a.attribute_code, a.frontend_label, CAST(v.value AS CHAR) AS value
  FROM catalog_product_entity_int v
  JOIN eav_attribute a ON a.attribute_id=v.attribute_id
  JOIN eav_entity_type t ON t.entity_type_id=a.entity_type_id AND t.entity_type_code='catalog_product'
  WHERE v.store_id=0 AND v.value IS NOT NULL
  UNION ALL
  SELECT v.entity_id, a.attribute_id, a.attribute_code, a.frontend_label, CAST(v.value AS CHAR) AS value
  FROM catalog_product_entity_decimal v
  JOIN eav_attribute a ON a.attribute_id=v.attribute_id
  JOIN eav_entity_type t ON t.entity_type_id=a.entity_type_id AND t.entity_type_code='catalog_product'
  WHERE v.store_id=0 AND v.value IS NOT NULL
) attrs
ORDER BY entity_id, attribute_code;
`);

const categories = new Map();
for (const row of categoryRows) {
  const [
    id,
    parentId,
    path,
    position,
    level,
    name,
    urlPath,
    image,
    description,
    metaTitle,
    metaDescription,
    isActive,
    includeInMenu,
  ] = row;
  categories.set(Number(id), {
    id: Number(id),
    parentId: Number(parentId),
    path,
    position: Number(position),
    level: Number(level),
    name: clean(name),
    urlPath: normalizePath(urlPath),
    route: routeKey(urlPath),
    image: image ? `/media/catalog/category/${normalizePath(image)}` : null,
    description: cleanHtml(description),
    metaTitle: clean(metaTitle),
    metaDescription: clean(metaDescription),
    isActive: isActive === "1",
    includeInMenu: includeInMenu === "1",
    productIds: [],
    children: [],
  });
}

for (const category of categories.values()) {
  if (categories.has(category.parentId)) categories.get(category.parentId).children.push(category.id);
}

const products = new Map();
const optionLabels = new Map(
  optionRows.map(([attributeId, optionId, label]) => [`${attributeId}:${optionId}`, clean(label)]),
);
for (const row of productRows) {
  const [
    id,
    sku,
    type,
    name,
    urlPath,
    image,
    smallImage,
    thumbnail,
    description,
    shortDescription,
    metaTitle,
    metaDescription,
    price,
    specialPrice,
    status,
    visibility,
    manufacturerId,
    manufacturer,
    brand,
  ] = row;
  const normalizedUrl = normalizePath(urlPath);
  const resolvedBrand = resolveOptionValue(264, brand, optionLabels);
  products.set(Number(id), {
    id: Number(id),
    sku,
    type,
    name: clean(name) ?? sku,
    urlPath: normalizedUrl,
    route: routeKey(normalizedUrl),
    brand: resolvedBrand ?? clean(manufacturer),
    manufacturer: clean(manufacturer),
    manufacturerId: manufacturerId ? Number(manufacturerId) : null,
    status: status === "1" ? "enabled" : "disabled",
    visibility: Number(visibility),
    image: mediaPath(image),
    smallImage: mediaPath(smallImage),
    thumbnail: mediaPath(thumbnail),
    gallery: [],
    description: cleanHtml(description),
    shortDescription: cleanHtml(shortDescription),
    metaTitle: clean(metaTitle),
    metaDescription: clean(metaDescription),
    price: price ? Number(price) : null,
    specialPrice: specialPrice ? Number(specialPrice) : null,
    categoryIds: [],
    files: [],
    attributes: {},
    routes: normalizedUrl ? [routeKey(normalizedUrl)] : [],
  });
}

for (const [productId, categoryId] of productCategoryRows) {
  const product = products.get(Number(productId));
  const category = categories.get(Number(categoryId));
  if (!product || !category) continue;
  product.categoryIds.push(Number(categoryId));
  category.productIds.push(Number(productId));
  const categoryProductPath = productUrlFromCategory(category.urlPath, product.urlPath);
  const route = routeKey(categoryProductPath);
  if (route && !product.routes.includes(route)) product.routes.push(route);
}

for (const [productId, value] of galleryRows) {
  const product = products.get(Number(productId));
  const path = mediaPath(value);
  if (product && path && !product.gallery.includes(path)) product.gallery.push(path);
}

for (const [fileId, productId, fileUrl, fileName, fileLink, fileLabel] of fileRows) {
  const product = products.get(Number(productId));
  if (!product) continue;
  const id = Number(fileId);
  const filename = clean(fileName) ?? clean(fileUrl);
  product.files.push({
    id,
    name: cleanLabel(fileLabel) ?? filename,
    filename,
    path: filePath(fileUrl),
    link: clean(fileLink),
    legacyDownloadPath: `/amfilerating/file/download/file_id/${id}/`,
  });
}

for (const [productId, attributeId, code, label, rawValue] of attributeRows) {
  if (CORE_PRODUCT_ATTRIBUTES.has(code)) continue;
  const product = products.get(Number(productId));
  const value = resolveOptionValue(attributeId, rawValue, optionLabels);
  if (!product || !value) continue;
  const key = clean(label) ?? code;
  product.attributes[key] = value;
}

const routes = {};
for (const category of categories.values()) {
  if (category.route) {
    routes[category.route] = { type: "category", id: category.id };
  }
}
for (const product of products.values()) {
  for (const route of product.routes) {
    if (!route) continue;
    routes[route] = { type: "product", id: product.id };
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  source: {
    database: DB,
    mediaBasePath: MEDIA_BASE_PATH,
    fileBasePath: FILE_BASE_PATH,
  },
  counts: {
    products: products.size,
    categories: categories.size,
    routes: Object.keys(routes).length,
    downloadableFiles: fileRows.length,
  },
  products: Object.fromEntries([...products.entries()].map(([id, value]) => [id, value])),
  categories: Object.fromEntries([...categories.entries()].map(([id, value]) => [id, value])),
  routes,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, "summary.json"),
  `${JSON.stringify(
    {
      generatedAt: output.generatedAt,
      source: output.source,
      counts: output.counts,
    },
    null,
    2,
  )}\n`,
);
writeFileSync(join(OUT_DIR, "products.json"), `${JSON.stringify(output.products, null, 2)}\n`);
writeFileSync(join(OUT_DIR, "categories.json"), `${JSON.stringify(output.categories, null, 2)}\n`);
writeFileSync(join(OUT_DIR, "routes.json"), `${JSON.stringify(output.routes, null, 2)}\n`);

console.log(`Exported ${output.counts.products} products`);
console.log(`Exported ${output.counts.categories} categories`);
console.log(`Exported ${output.counts.routes} preserved routes`);
console.log(`Exported ${output.counts.downloadableFiles} downloadable file references`);
console.log(`Wrote ${OUT_DIR}`);
