# Webshop playbook & launch plan

> **✍️ Copy style rule (all customer-facing text):** never use em-dashes (—) or en-dashes (–). Use a comma or restructure the sentence; write numeric ranges as "1.0 to 12.5 mm" (not "1.0–12.5 mm"). Hyphens in compound words are fine (high-precision, semi-automatic, be-ri). Applies to every hero/link-box/sourcing blurb, product overview, and Features/Specifications value.

> **🧭 Production-Equipment menu ↔ footer are now AUTO-SYNCED (single source of truth).** The footer's "Production Equipment" column is **derived** from the mega-menu: `Footer.tsx` imports `productionEquipmentGroup` from `src/data/navigation.ts` and maps `.items` → `{label, href}`. So to add / rename / reorder a PE section, edit **ONLY** `productionEquipmentGroup.items` in `navigation.ts` — the footer follows automatically. (This replaced a hand-copied footer list that had drifted: the Z&F-combined "Stripping and crimping machines" section was in the menu but got missed in the footer.) Each menu item = a section with brand `children`; a brand can appear under several sections (Tekuwa under Cutting AND Stripping; Z&F under several). ⚠️ The footer's OTHER columns (Industrial Components, Brands, Company) are still hand-maintained — sync those manually if the components menu changes.
>
> **🔲 Brand-page link boxes — layout by count (locked).** A section's boxes render by `boxes.length`: **1 box → full-width Zoller & Fröhlich-style banner** (big image left `sm:w-72 lg:w-96`, text right, `rounded-2xl`); **2 boxes → compact side-by-side Branson grid** (`w-28 sm:w-40` image, `sm:grid-cols-2`); **3+ boxes → same compact card, 3-up on desktop** (`sm:grid-cols-2 lg:grid-cols-3`, e.g. Mecal: Applicators / Crimping machines / Stripping and crimping machines). All 2-box cards share `min-h-[176px]` + `justify-center` text so every 2-box page is the **same size** (Wezag baseline); heavier-copy pages like Branson grow a touch taller. Change that one `min-h` to resize all 2-box pages at once. Always picture-LEFT / text-RIGHT (image-on-top was rejected). Box images that are square product shots on white (Mecal) use `fit:"contain"` so the whole machine shows in the tall card; application/photo boxes use `fit:"cover"`. Config: `CategoryLinkSection` = `{eyebrow, boxes}` in `CatalogueCategoryPage.tsx`.
>
> **🗂️ Menu-derived brand-box landings (the "Connectors" template — LIVE on all hubs).** Every clickable dropdown entry renders a consistent **brand-box landing** (one box per brand under it), NOT a raw product grid (a grid at hub level felt like a "leak"). Boxes are derived from the menu tree via `getMenuBrandHub(route)` in `src/data/navigation.ts` (+ each brand's logo from `brands.ts`), so they stay complete/correct automatically (single source of truth, like the footer). A **category** (Connectors, Cutting Machines…) → its brand boxes; a **section root** (Industrial Components, Production Equipment) → **brands grouped by category** (user's choice); **single-brand categories** (Heat Shrink→HongShang, Contacts→Deutsch) still show one box (user's choice, adds a click). The product grid lives **only on the actual brand/leaf page**. Each box shows the brand's **catalogue-item count** (`N items · M areas`); lean/no-grid brands and non-catalogue links (Z+F `/products` landing) show `View brand`. Rendering: `BrandBoxCard` + `brandHubBlock` in `CatalogueCategoryPage.tsx`; activates whenever `getMenuBrandHub(category.route)` matches (forces off `showProductBrowser`/`showVisualLinks`/`showGenericCategoryCards` and shows a brand-count hero stat). **A curated `CATEGORY_LINK_SECTIONS` takes precedence** over the generic brand hub, so the welding hub (77) keeps its welding-type split and the Mav "Test equipment" hub (76, self-linking single child) stays its lean page. Retires the fragile old boxes that came from hand-authored Magento `description` HTML (which was missing Z&F etc.). Logo resolution order: `BRAND_BOX_LOGO_OVERRIDES[catId][slug]` (per-page) → `BRAND_BOX_LOGO_GLOBAL[slug]` (brand-box-wide fix) → brand's `brands.ts` logo. ⚠️ **Sealed-connectors (43) logo rule (customer, this page only):** the **TE** box uses the customer's fresh tile `/media/brand-logos/te-connectivity.jpg` (swap TE here only). **Deutsch** shows its correct mark `…/category_images/Deutsch.jpg` in **every** brand box via `BRAND_BOX_LOGO_GLOBAL` — because a latent global bug gives BOTH Deutsch and TE the same `te-connectivity.svg` (a TE mark) in `brands.ts`; that global file is left untouched per the user (do not "fix" it globally without go-ahead). NB on section-root overviews the TE box still uses the old `te-connectivity.svg` (a valid TE logo), since the fresh tile is scoped to page 43 — confirm with the user if they want the new tile everywhere.
>
> **♻️ "Leak" cleanup — unrepresented suppliers:** dropped-supplier categories often have all products `disabled` (so listings/search/detail-pages are clean) BUT their **category-hub URLs still resolve** (empty pages) until added to `HIDDEN_CATEGORY_IDS` in `src/lib/magentoCatalogue.ts`. That's the "leak". When we stop representing a supplier, hide its category id(s) there. Done for: Komax, and the Test & Quality sub-brands Electrical Testers (78) / Cirris (114) / TSK (1674) / Mechanical Pull Testers (79) — parent Test & Quality (76) kept and repurposed as the Mav Prüftechnik "Test equipment" page.

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
- [x] **Wezag** — Tier B lean landing (cat 110, `…/crimping-equipment/wezag.html`): black-framed header photo + two link boxes to the sister brands **Private Label Tools** (hand tools) & **WDT Machines** (presses) + sourcing box; NO product grid (`HIDE_PRODUCT_GRID_CATEGORY_IDS`). WZ products outdated/low-volume — grid dropped, detail pages left orphaned (not hidden). LOCKED.
- [x] **Feintechnik Rittmeyer (be-ri)** — Tier A (cat 106, leaf-of-flat-hub under Stripping Machines). New brand `feintechnik-rittmeyer` (be-ri logo badge). Header photo (AM.ALL.ROUND render from their site) + rewritten intro + single "Wire stripping machines" link box (eyebrow "be-ri cable processing machines") + grid KEPT (4 machines) + cleaned "Brand" filter + sourcing box. Both link box & sourcing box → rittmeyer-beri.de/en/cable-processing/. Swedish product names translated. **Product pages (1780-1783):** Branson-template English overview + Features/Specifications boxes, every spec verified against each product's rittmeyer-beri.de page (no invented values). Product URLs renamed to clean English (`am-strip-1.html`, `am-strip-2.html`, `am-strip-500-750-1000.html`, `am-all-round.html`) via `PRODUCT_CANONICAL_ROUTES`; old Swedish `avmantlingsmaskin-…` slugs 301-redirect. **LOCKED & DONE.**
- [x] **Ulmer** — Tier A (cat 100, leaf-of-flat-hub under Cutting Machines). Header photo + intro + single link box (customer copy) → ulmer-gmbh.net/produkte-loesungen/schneiden/ + grid KEPT + cleaned "Brand: Ulmer" filter (hide `Cutting machine Brands`) + sourcing box. Brand already in brands.ts (badge auto-resolves). **Grid curated to their live catalogue:** hid 8 discontinued machines (SM 15 2PLC/2PE, SM 30 2PLC/2PE, WSM 60 ESB, SSM 800, SMM 40, SX 30 → `HIDDEN_PRODUCT_IDS`), kept the 6 current "touch" models. **Product pages (6 kept machines):** Branson-template English overview + Features/Specifications boxes, extracted from our own English product copy (SM 15 2PT spec table; each machine's descriptive text), all dash-free. **DONE.**
- [x] **Tekuwa** — LEAN page (cat 101, `HIDE_PRODUCT_GRID`), no grid. Header photo + intro + TWO link boxes (cutting → tekuwa.de/en/cutting-lengthing/, stripping → tekuwa.de/en/lengthing-and-stripping/) side-by-side + sourcing box. Brand already in brands.ts (badge auto-resolves). Cat lives under Cutting Machines but ALSO added to the **Stripping Machines** dropdown (does both). Sourcing link → tekuwa.de/en/machines/. Stripping-box copy is the customer's verbatim ("provide and ensures" — accepted as-is). **LOCKED & DONE.**
- [x] **Mav Prüftechnik (Test equipment)** — LEAN 2-box page on the repurposed Test & Quality hub (cat 76, `CATEGORY_BRAND_OVERRIDES`→mav, `HIDE_PRODUCT_GRID`). Header photo (KMG display) + intro + two boxes (Manual force testers, Motorized force testers → mav-germany.de) + sourcing box → mav-germany.de/home.html. Menu section "Test equipment" (after Branson) + footer. Unrepresented Test & Quality sub-brands hidden. **LOCKED & DONE.**
- [x] **Mecal** — Tier B lean landing (cat 111, `…/crimping-equipment/mecal.html`): facility header photo + **three** link boxes (Applicators / Crimping machines / Stripping and crimping machines, each → Mecal's own product pages, `fit:"contain"`) + sourcing box; NO product grid (`HIDE_PRODUCT_GRID_CATEGORY_IDS`, `sm:grid-cols-2 lg:grid-cols-3`). Brand badge auto-resolves from route segment `mecal` (no `CATEGORY_BRAND_OVERRIDES` needed). Listed in the menu under both **Crimping machines and tools** and **Stripping and crimping machines**. Header/box copy customer-supplied, dash-free (fixed two grammar slips). **↩️ Old grid preserved & reversible:** the 27 Mecal catalogue products are NOT hidden (not added to `HIDDEN_PRODUCT_IDS`/`HIDDEN_CATEGORY_IDS`), only the grid *rendering* is suppressed by the one `HIDE_PRODUCT_GRID_CATEGORY_IDS` flag — **remove `111` from that set to restore the exact original product grid** (no data lost, nothing to rebuild). Same reversible pattern as Wezag/Tekuwa/Mav. **LOCKED & DONE.**
- [x] **Junquan** — Tier A (cat 102, `…/cutting-machines-for-a-variety-of-materials/junquan.html`, leaf-of-flat-hub under Cutting Machines). New brand `junquan` in brands.ts (local logo `/images/partners/junquan.gif`, badge auto-resolves from route segment; already in the Cutting Machines menu + `equipment.ts`). Facility header photo + intro (customer copy) + single link box (full-width banner) → cuttingstripping-machine.com/products.html + sourcing box (same URL). **Grid KEPT** (one product); `Cutting machine Brands` filter already hidden/relabelled (from Ulmer) → shows clean "Brand: Junquan". **Product page (JQ-6100, 1831):** renamed "JQ-6100 Digital Cutting Machine", overview + Features/Specifications boxes built from its own spec table, dash-free. Fixed source typos (Numercal→Numerical; Juanquan→Junquan). Box text left the customer's "Industry" capitalisations verbatim (flagged). ⚠️ *A live-page dash scan of this hub shows 5 en-dashes — these are **Ulmer's** raw product `description` fields riding along in the borrowed cutting-machine facet pool (never rendered; Ulmer uses Features/Specs boxes), NOT Junquan copy.* **LOCKED & DONE.**
- [ ] **Metzner, Ramatech — ON HOLD** ⏸️ until the agent agreement is finalised and signed (we do not yet represent them). Do not build their pages until the user gives the go-ahead.
- [ ] **JDD Tech (component side) — LATER** ⏸️ set up a brand page (in parallel with Metzner/Ramatech). Component brand, already in `brands.ts` (`jdd-tech`). Deferred at the user's request; revisit on their go-ahead.
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
