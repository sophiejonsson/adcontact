# Webshop playbook & launch plan

Living document. Two purposes:

1. **Best practice** — how we turned Zoller & Fröhlich into a self-contained brand section (so we can repeat it).
2. **Agenda** — what's left for production equipment, plus the site-wide pre-launch checklist.

Last updated: 2026-07-05 (production equipment: Branson + Zoller & Fröhlich locked as the two reference templates).

---

## Part 1 — Best practice: bring a brand's product pages onto our site (the "Z&F pattern")

**Principle:** when a brand's own site is where the useful content lives (product-range tables, application copy, certifications), we *reproduce it on our site* instead of linking out — so the visitor stays with us and every path leads back to a sourcing request. All borrowed media is mirrored into **our Cloudflare R2** so we own it and can swap it later if the manufacturer changes their page.

Reference implementation:
- Hub page: `src/components/catalogue/ZFerrulesPage.tsx` (rendered for category id 1711 via `src/app/webshop/[...path]/page.tsx`).
- Reproduced category pages: `src/app/products/zoller-frohlich/ferrules/[slug]/page.tsx` (data-driven).

### The recipe

1. **Streamline the hub.**
   - Remove the "Go to partner shop" / partner box from the header.
   - Add the shared **"Can't find the exact part?"** sourcing CTA (mailto + a "View <brand> catalogue" link to the brand site).
   - Header is a two-column hero: logo + title + intro on the left, an **application photo** on the right.
   - Each category card gets an `internalHref` → the reproduced page; cards without one still open the manufacturer in a new tab.
   - Drop categories we don't sell/promote (for Z&F we removed *Assortment boxes* and *Terminals*).

2. **Build the reproduced page (data-driven).**
   - One `[slug]` route with a `FERRULE_PAGES`-style map; adding a category = adding a data entry (+ its assets). `generateStaticParams` + `generateMetadata` included.
   - Each page: two-column hero (header photo = **the same image as the category card**), then one or more **sections**.
   - A section = heading + subheading + copy (paragraphs / bulleted sub-sections) + **range tables** + the **approval mark**.
   - **Layout rule:** a section with **one** table uses the zig-zag (text ⇄ table, alternating by index); a section with **several** tables puts the copy on top and stacks the tables full-width below, captioned by delivery form (single bag / belt-ware / reduced-width / short-circuit-proof).
   - Certifications are shown as a **logo image** (Z&F publish a combined **CSA + UL Certified** mark); DIN standards stay in the body copy, exactly like the source page.
   - End every page with the **sourcing CTA** + a "Back to <hub>" link.

3. **Asset pipeline (each category).**
   - Fetch the manufacturer page's **raw HTML** with a browser User-Agent (the small summariser misses tables; pull HTML and parse).
   - The "tables" are usually **SVGs**, not `<table>` tags. Distinguish real spec tables (≥ ~40 `<text>` nodes) from dimension drawings (0 text). **Exclude only** `…-zeichnung.svg` and the standalone `zoller-froehlich-eurolochstanzung.svg` — do **not** exclude files named `…-mit-eurolochstanzung.svg` (those *are* the tables, "with euro hole punch").
   - **Font-swap the SVGs before hosting:** they set `font-family: HelveticaNeueLT-LightExt` in an internal `<style>` with no embedded font. Replace it with `Arial, 'Helvetica Neue', Helvetica, sans-serif` (Arial is narrower than the design font, so cells don't overflow).
   - Upload to R2 under `zoller-frohlich/<slug>/…` (tables) and reuse `zoller-frohlich/certificates/…` for the shared marks. Serve via the `/media/[...]` proxy. Verify each returns `200` with the right content-type.
   - Header photo = mirror the hub-card image to R2 (`…/hero-card.jpg`).

4. **Gotchas (learned the hard way).**
   - The hub URL is **not** guessable — `ZFerrulesPage` renders for **category id 1711** = `/webshop/components/sealed-connectors/zoller-frohlich.html`. Get real URLs from `src/data/generated/magento-catalogue/routes.json`, don't invent them.
   - The `/media` proxy sets `Cache-Control: max-age=86400`. **Don't overwrite an existing image key** (stale for up to 24 h) — upload under a fresh filename.
   - **Pasted/inline images are not written to disk.** When the user "uploads" a picture they drop the file into their OneDrive-synced copy: `C:\Users\Stefan\OneDrive - ADCONTACT AB\Dokument\Code ADCGAM 2026\`. Grab it there, then mirror to R2.
   - No `node_modules` locally and no image tooling (PIL/sharp/rsvg) — can't typecheck or resize locally; Vercel builds validate. Some hero JPGs are large (up to ~3 MB); downscale later when tooling is available.

5. **Deploy & verify loop.** Commit → push to `main` → Vercel builds (~3–6 min) → verify the live page (poll the deployed URL) → tell the user to hard-refresh (Ctrl/Cmd+Shift+R). Fetch/rebase before pushing (multiple agents share the repo).

**Status:** Zoller & Fröhlich ferrules **done** — 6 categories reproduced (ferrules-on-reel, insulated, insulated-twin, multi-standard-conductors, belt-strips, uninsulated), hub trimmed to 6 internal cards, application photo in the header.

---

## Part 2 — Agenda: production equipment (parity with components)

**Goal:** give the `production-equipment` section the same behaviour we built for components.

Context (from the catalogue):
- 8 equipment brands: **Mecal, Zoller + Fröhlich** (they also make wire-processing machines), **Metzner, Ramatech, Wezag, Tekuwa, Mav Prüftechnik, Ulmer**. (`src/data/brands.ts`, `linecardSection: "equipment"`.)
- Unlike components (brand-first), production equipment is organised by **machine type**: cutting, stripping, crimping, marking, test/quality, ultrasonic welding, misc — plus many individual machine pages (Komax, Mecal, etc.). (`routes.json`.)

**Guiding principle (locked):** production equipment is **channel-protected** by supplier agreements in the regions we support, and most legacy equipment products are EOL. So keep these pages **lean — reference + redirect + capture the enquiry**, not full internal catalogues. Components are treated differently (we stock, add selection value, richer pages) — intentionally. **Every production-equipment brand page carries the "Can't find the exact machine for your application?" box.**

### Two reference templates (both live & locked)

**Tier A — full reference (BRANSON).** Use when we curate a few *current* machines on-site.
- Machine-type hub via `CatalogueCategoryPage`: header photo (`CATEGORY_HEADER_IMAGES`) · compact **"Browse by <type>"** cards (`CATEGORY_WELDING_TYPES`, image-left/text-right, linking to the supplier's range pages) · curated product grid (hide EOL via `HIDDEN_PRODUCT_IDS` / `HIDDEN_CATEGORY_IDS`) · sourcing box (`CATEGORY_SOURCING_CTA`).
- Curated product pages (`PRODUCT_OVERRIDES` + `PRODUCT_PRESENTATIONS`): verbatim supplier overview + Features / Specifications boxes · canonical URL (`PRODUCT_CANONICAL_ROUTES`) · no lead-time / additional-info / highlights / drawings · **"Request full specification and a quote"** CTA. *(Verify any fetched marketing bullets against the supplier's raw HTML — the auto-summariser fabricated a "features" list once.)*

**Tier B — lean redirect-only landing (ZOLLER & FRÖHLICH).** Use when the brand's equipment catalogue is legacy/EOL and they maintain a current site.
- A standalone landing page (e.g. `src/app/products/zoller-frohlich/wire-processing/page.tsx`): two-column hero (title + intro + application photo) · **NO grid/filter** · one image-left/text-right "link box" (brand blurb → supplier site) · the "Can't find the exact machine…?" sourcing box. `/products/<brand>/…` URLs are SEO-fine.

### Per-brand recipe & status
- [x] **Branson** — Tier A (welding hub + GMX-W1 / Ultraseal20 product pages).
- [x] **Zoller & Fröhlich** — Tier B (wire-processing landing; listed under Stripping Machines, Crimping machines & a combined header).
- [ ] **Mecal, Metzner, Ramatech, Wezag, Tekuwa, Mav Prüftechnik, Ulmer** — for each: inventory → pick Tier A/B → header photo (user supplies) + ranges/curated products or link box + sourcing box.
- [ ] **Legacy Z&F equipment grid pages** (stripping/crimping + ~50 EOL products) still resolve by direct URL — decide: redirect to the Z&F landing or hide (`HIDDEN_CATEGORY_IDS`).

---

## Part 3 — Pre-launch checklist (site-wide)

- [ ] **Web forms** — contact + sourcing forms wired to a real inbox (currently the CTA uses `mailto:info@adcontact.se`; replace with proper forms where needed). Confirm the send address(es).
- [ ] **Captcha** — add to every public form (spam protection). Pick provider (e.g. hCaptcha / Cloudflare Turnstile / reCAPTCHA).
- [ ] **Sitemap + robots** — generate `sitemap.xml` (all products, categories, brand/reproduced pages) and `robots.txt`.
- [ ] **Cookie consent** — consent banner/pop-up before any non-essential cookies/analytics fire.
- [ ] **301 redirects (Google history) — CRITICAL.** Map every legacy Magento URL to its new URL so search history/juice is preserved. Known items:
  - Legacy `/catalog/product/view/id/…` media/product URLs (see `src/app/catalog/[...path]/route.ts`) — the proxy defaults `LEGACY_WEBSHOP_ORIGIN` to `www.adcontact.se`, which will **self-loop once we go live on that domain**. Must be resolved before launch.
  - Build/verify the full old→new redirect map (products, categories, brands).
- [ ] **Go-live cleanup** — remove the Oderland media fallback once fully on R2; final link/media audit; confirm canonical domain.

---

*Maintainer note:* deep implementation notes and gotchas also live in the agent memory (`webshop-catalogue-patterns`, `cloudflare-r2-media`, `deploy-push-workflow`, `multi-session-coordination`). Keep this file as the human-readable plan; update the checkboxes as items land.
