# Adcontact — Industrial Components & Wire-Processing Solutions

Modern B2B industrial website for Adcontact AB, built with Next.js App Router, TypeScript, and Tailwind CSS v4.

## Tech stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Deployment:** Vercel (Node.js runtime)

## Getting started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment to Vercel

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set the environment variables from `.env.example`
4. Deploy — Vercel auto-detects Next.js

**Build command:** `npm run build`  
**Output directory:** `.next` (automatic)  
**Node.js version:** 20.x or 22.x

## Project structure

```
src/
  app/                          # Next.js App Router pages
    page.tsx                    # Homepage
    products/
      page.tsx                  # Products overview
      [category]/
        page.tsx                # Category listing
        [slug]/
          page.tsx              # Product detail
    production-equipment/
      page.tsx                  # Equipment overview
      [slug]/page.tsx           # Equipment category
    brands/
      page.tsx                  # Full linecard
      [slug]/page.tsx           # Brand detail
    resources/
      page.tsx                  # Resources listing
      [slug]/page.tsx           # Resource detail
    about/page.tsx              # About page
    contact/page.tsx            # Contact & RFQ page
    api/
      products/route.ts         # GET /api/products
      search/route.ts           # GET /api/search
      rfq/route.ts              # POST /api/rfq
      brands/route.ts           # GET /api/brands

  components/
    layout/
      Header.tsx                # Sticky header with mega-menu
      MegaMenu.tsx              # Dropdown mega-menu
      Footer.tsx                # Dark footer
      Breadcrumbs.tsx           # Page breadcrumbs
    home/
      HeroSearch.tsx            # Hero section with search
      CategoryGrid.tsx          # Product category cards
      TrustSection.tsx          # Proof/trust points
      IndustriesSection.tsx     # Industries served
      EquipmentSection.tsx      # Production equipment preview
      BrandsSection.tsx         # Brand/linecard preview
      ResourcesSection.tsx      # Technical resources preview
      CTASection.tsx            # Final conversion block
    ui/
      ProductFinder.tsx         # Interactive product search
      RFQForm.tsx               # Quote request form

  data/                         # Mock data (replace with DB later)
    categories.ts               # Product categories
    products.ts                 # Product catalogue
    brands.ts                   # Manufacturer brands
    industries.ts               # Industry sectors
    resources.ts                # Technical resources
    equipment.ts                # Production equipment
    navigation.ts               # Navigation structure

  lib/
    utils.ts                    # Utility functions (cn, slugify)
```

## Editing content

### Products
Edit `src/data/products.ts` to add, modify, or remove products. Each product has:
- `id`, `name`, `slug`, `partNumber`
- `category`, `categorySlug`, `brand`, `brandSlug`
- `specs[]` — technical specifications
- `tags[]` — searchable tags
- `applications[]` — application areas
- `standards[]` — compliance standards

### Categories
Edit `src/data/categories.ts` to add or modify product categories. The `slug` must match the URL path.

### Brands
Edit `src/data/brands.ts` to add brands to the linecard.

### Navigation
Edit `src/data/navigation.ts` to modify the mega-menu structure.

## API routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/products` | GET | List/search products. Query: `q`, `category`, `brand`, `featured`, `page`, `limit` |
| `/api/search` | GET | Full-text search across products, categories, brands. Query: `q` |
| `/api/rfq` | POST | Submit quote request. Validates and logs the request |
| `/api/brands` | GET | List brands. Query: `featured`, `category` |

## Connecting a real backend

### Email (RFQ form)
In `src/app/api/rfq/route.ts`, replace the `console.log` placeholder with your email service:

```typescript
// Resend
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "rfq@adcontact.se",
  to: process.env.RFQ_EMAIL_RECIPIENT!,
  subject: `New RFQ from ${body.company}`,
  text: JSON.stringify(body, null, 2),
});
```

### Product database
Replace the imports from `src/data/*.ts` with API calls or ORM queries. The data shape maps directly to a PostgreSQL/Supabase schema.

## Future extensions

- Full-text product search with Algolia or Meilisearch
- Real product catalogue from Supabase / PostgreSQL
- Multi-language support (Swedish, Finnish, Norwegian)
- Quote basket / RFQ cart with session storage
- Customer portal with order history
- Inventory availability via ERP API

## Contact

Adcontact AB · Ekbacksvägen 22 · SE-168 69 Bromma, Sweden  
+46 (0)8-445 36 00 · info@adcontact.se
# Legacy webshop origin

The original `/webshop/...` URL structure is preserved. Fully migrated pages are
served locally; remaining legacy pages are fetched from `LEGACY_WEBSHOP_ORIGIN`,
which defaults to `https://www.adcontact.se`. Before switching production DNS to
this app, set that variable to the legacy site's alternate origin hostname.
