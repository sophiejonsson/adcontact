# Go-Live Checklist — Adcontact / Gammeter webshop

Practical, step-by-step guide to move the site onto **your own** Vercel account,
connect GitHub + Cloudflare, point the Loopia domain, and go live. Written to be
followed top to bottom. Tick each box as you go.

> **How deploys work (unchanged after migration):** the site is a Next.js app in
> the GitHub repo `stefankolic/adcontact`. Every push to the `main` branch makes
> Vercel automatically build and publish the new version (~3–5 min). You never
> upload files by hand. Once your own Vercel project is connected to this repo,
> that same automatic flow is yours.

---

## 1. Accounts you need

- [ ] **GitHub** account with **admin/owner** access to `stefankolic/adcontact`
      (so Vercel is allowed to connect and auto-deploy). If the repo is under
      someone else's account, get transferred as owner or added as an admin first.
- [ ] **Vercel** account (sign up with your GitHub login — simplest).
- [ ] **Cloudflare** account (this is where the product images live, in "R2").
- [ ] **Loopia** account (where the domain is registered).

---

## 2. Create the Vercel project

1. [ ] In Vercel: **Add New… → Project → Import** the `stefankolic/adcontact` repo.
2. [ ] Framework preset auto-detects as **Next.js** — leave the build settings at
       their defaults (no changes needed).
3. [ ] **Do not deploy yet** — first add the environment variables (next section),
       otherwise images and the quote form will not work.

---

## 3. Environment variables (the #1 thing that breaks a migration)

The site reads a handful of settings from "environment variables". These are **not**
in the code — they must be re-entered in your new Vercel project under
**Project → Settings → Environment Variables**. Copy the **values** from the current
project's settings (they are secrets, so they can only be read there, not from code).

| Variable | What it controls | Notes |
|---|---|---|
| `R2_MEDIA_ORIGIN` | **All product & brand images and PDFs** (served from Cloudflare R2). | If this is wrong/missing, every catalogue image breaks. See section 4. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, the sitemap, and social-share previews. | **Set to your real domain** (e.g. `https://www.adcontact.se`), NOT the `*.vercel.app` address. |
| `RFQ_EMAIL_RECIPIENT` | The inbox that "Request a quote" form submissions are sent to. | Confirm it points at the right mailbox. |
| `ORDERLAND_MEDIA_ORIGIN` | Fallback source for older images not yet copied into R2. | Keep the current value. |
| `ORDERLAND_MEDIA_FALLBACK_ORIGIN` | Secondary image fallback. | Keep the current value (if set). |
| ~~`LEGACY_WEBSHOP_ORIGIN`~~ | No longer used (removed 2026-07-12) — `/catalog/...` legacy URLs now redirect by id instead of proxying to an origin. | Nothing to set. |

- [ ] All variables above added to the new project (Production environment).
- [ ] `NEXT_PUBLIC_SITE_URL` updated to the **final domain**.
- [ ] A template of the variable **names** lives in [`.env.example`](../.env.example)
      at the repo root for reference.

---

## 4. Cloudflare R2 (the image store)

The thousands of catalogue images live in a Cloudflare **R2 bucket** named
`adcontact-media`, served to the site through `R2_MEDIA_ORIGIN`.

- [ ] Confirm the `adcontact-media` bucket is under **your** Cloudflare account.
      If it is under a different account, either get access, or copy it to your own
      bucket (a one-time bucket-to-bucket copy — ask your developer/Claude to run it).
- [ ] **For production, give the bucket a custom domain** in Cloudflare
      (e.g. `media.adcontact.se`) and set `R2_MEDIA_ORIGIN` to that. The temporary
      `*.r2.dev` address is rate-limited and not meant for real traffic.
- [ ] After changing `R2_MEDIA_ORIGIN`, redeploy and spot-check a few product images.

---

## 5. Point the domain (Loopia → Vercel)

1. [ ] In Vercel: **Project → Settings → Domains → Add** your domain
       (add both `adcontact.se` and `www.adcontact.se`).
2. [ ] Vercel will show the DNS records to create. Choose **one** approach at Loopia:
   - **Option A — DNS at Loopia (simplest):** in Loopia's DNS editor add
     `A  @  → 76.76.21.21` and `CNAME  www → cname.vercel-dns.com`.
   - **Option B — DNS via Cloudflare:** change the nameservers at Loopia to the two
     Cloudflare nameservers, then manage the same records inside Cloudflare. Handy
     since your images are already on Cloudflare. Set those records **DNS-only /
     "grey cloud"** (not the orange proxy) so they work cleanly with Vercel.
3. [ ] Wait for DNS to propagate (minutes to a few hours). Vercel issues the HTTPS
       (SSL) certificate automatically once it verifies the domain.
4. [ ] Decide the primary: redirect `adcontact.se` → `www.adcontact.se` (or the
       reverse) in Vercel's Domains screen so there is one canonical address.

---

## 6. Pre-launch test pass (do this on the Vercel preview URL first)

- [ ] Home page loads; header menu opens; footer shows both office boxes.
- [ ] **Images load** across several catalogue pages (brand logos, product photos).
- [ ] Browse each Webshop dropdown item — every category shows a brand-box landing.
- [ ] Open a product page — specs/features render, no broken images.
- [ ] **Submit a test "Request a quote"** — confirm the email arrives at
      `RFQ_EMAIL_RECIPIENT`.
- [ ] Click the footer links (Quality → `/quality`, About, Contact, LinkedIn).
- [ ] Check a few old URLs still redirect (e.g. a renamed product) rather than 404.
- [ ] View on a phone — layout, menu, and footer read well on mobile.

---

## 7. Flip to live

- [ ] Domain verified and serving over HTTPS.
- [ ] `NEXT_PUBLIC_SITE_URL` = the live domain, and the site redeployed after setting it.
- [ ] **Disconnect / delete the old `adcontact-six` Vercel project** so a single
      push doesn't build the site twice.
- [ ] Submit the sitemap (`/sitemap.xml`) in Google Search Console for the new domain.

---

## 8. After go-live — making changes

- You (or Claude) edit the code and **push to `main`** → Vercel rebuilds and
  publishes automatically in a few minutes. No manual uploads.
- Content that lives in code (menu, brand pages, copy) changes via a code edit +
  push. Images are added to the Cloudflare R2 bucket.
- If something looks stale in your browser after a deploy, hard-refresh with
  **Ctrl/Cmd + Shift + R**.

---

_Questions or a step that won't behave? Note where you're stuck and we'll work
through it together._
