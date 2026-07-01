import {
  CircuitBoard,
  Cable,
  Wrench,
  Layers,
} from "lucide-react";
import type { Metadata } from "next";
import BrandHero from "@/components/brand/BrandHero";
import CatalogueProductBrowser, {
  type SubcategoryOption,
} from "@/components/catalogue/CatalogueProductBrowser";
import {
  SectionHeader,
  BrandJumpNav,
  BrandApplications,
  BrandFAQ,
  BrandCTA,
} from "@/components/brand/BrandChrome";
import {
  getCatalogueCategory,
  getCategoryChildren,
  getCategoryProductCount,
  getCategoryAllProducts,
  type CatalogueCategory,
} from "@/lib/magentoCatalogue";

// Cvilux lives in the Magento catalogue as category 226 — ~888 products across
// 9 families. Render them through the same CatalogueProductBrowser used by the
// webshop hubs (Stocko, etc.) so the page is a real filterable/searchable
// catalogue, with each family available as a "Category" filter.
const CVILUX_CATEGORY_ID = 226;

function allDescendantCategoryIds(cat: CatalogueCategory): number[] {
  const ids = [cat.id];
  for (const childId of cat.children) {
    const child = getCatalogueCategory(childId);
    if (child) ids.push(...allDescendantCategoryIds(child));
  }
  return ids;
}

const cviluxCategory = getCatalogueCategory(CVILUX_CATEGORY_ID);
const cviluxCatalogueProducts = cviluxCategory
  ? getCategoryAllProducts(cviluxCategory)
  : [];
const cviluxSubcategoryOptions: SubcategoryOption[] = cviluxCategory
  ? getCategoryChildren(cviluxCategory)
      .filter((c) => getCategoryProductCount(c) > 0)
      .map((c) => ({
        id: c.id,
        name: c.name ?? "Category",
        count: getCategoryProductCount(c),
        allCategoryIds: allDescendantCategoryIds(c),
      }))
  : [];

const PAGE_URL = "https://www.adcontact.se/products/cvilux";

export const metadata: Metadata = {
  title: { absolute: "Cvilux Connectors | Wire-to-Board, FFC/FPC, I/O | Adcontact" },
  description:
    "Cvilux board-to-board, wire-to-board, FFC/FPC, I/O, power, and application tooling for electronic assemblies. LED lighting, HVAC, industrial electronics. Nordic distributor.",
  alternates: { canonical: PAGE_URL },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.adcontact.se/" },
    { "@type": "ListItem", position: 2, name: "Webshop", item: "https://www.adcontact.se/webshop.html" },
    { "@type": "ListItem", position: 3, name: "Connectors", item: "https://www.adcontact.se/webshop/components/sealed-connectors.html" },
    { "@type": "ListItem", position: 4, name: "Cvilux", item: PAGE_URL },
  ],
};

const features = [
  {
    icon: Layers,
    title: "Full interconnect range",
    body: "Board-to-board, wire-to-board, FFC/FPC, I/O, and power connectors, covering the whole signal path on a PCB.",
  },
  {
    icon: CircuitBoard,
    title: "Fine-pitch & SMT-ready",
    body: "Compact, fine-pitch series suited to dense, automated PCB assembly in modern electronic products.",
  },
  {
    icon: Wrench,
    title: "Matched tooling",
    body: "Desk-top machines and hand tools available alongside the connectors for consistent crimp terminations.",
  },
  {
    icon: Cable,
    title: "Broad application fit",
    body: "Widely specified in LED lighting, HVAC, white goods, industrial electronics, and consumer devices.",
  },
];

const applications = [
  "LED lighting and luminaires",
  "HVAC and refrigeration controls",
  "White goods and home appliances",
  "Industrial electronics and instruments",
  "Consumer electronics",
  "Power supplies and converters",
  "Display and AV equipment",
  "PCB and wire-harness assembly",
];

const faqs = [
  {
    q: "What types of connectors does Cvilux make?",
    a: "Cvilux Corporation is a Taiwan-based interconnect manufacturer producing board-to-board, wire-to-board, FFC/FPC, I/O, IC socket, and power connectors, along with the application tooling to terminate them.",
  },
  {
    q: "Does Cvilux supply FFC/FPC connectors?",
    a: "Yes. Cvilux offers FFC/FPC connectors (the CF series) for flat flexible cable and flexible printed circuit connections, commonly used in displays, cameras, and compact electronic assemblies.",
  },
  {
    q: "Is application tooling available?",
    a: "Yes. Cvilux supplies both desk-top machines and hand tools for terminating their crimp connectors. We can recommend and supply the right tooling for your chosen series and production volume.",
  },
  {
    q: "What industries use Cvilux connectors?",
    a: "Cvilux connectors are widely used in LED lighting, HVAC, white goods, industrial electronics, power supplies, and consumer devices, anywhere reliable wire-to-board and board-to-board interconnects are needed.",
  },
  {
    q: "Is Adcontact a Cvilux distributor?",
    a: "Adcontact is a Nordic distributor of Cvilux connectors and tooling, able to source the full Cvilux range including custom reel quantities, with technical support across the Nordic and Baltic region.",
  },
];

export default function CviluxPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <BrandHero
        crumbs={[
          { label: "Webshop", href: "/webshop.html" },
          { label: "Connectors", href: "/webshop/components/sealed-connectors.html" },
          { label: "Cvilux" },
        ]}
        logo="/images/Cvilux.png"
        glow="#2475b8"
        badge="Authorised distributor"
        title="Cvilux"
        titleAccent="Board, cable & I/O connectivity"
        description="Board-to-board, wire-to-board, FFC/FPC, I/O, and power connectors from Cvilux Corporation, a leading Taiwan-based interconnect manufacturer, widely used in LED lighting, HVAC, and industrial electronics."
        chips={["Board-to-Board", "Wire-to-Board", "FFC/FPC", "I/O", "Power", "IC Socket"]}
        specs={[
          { icon: Layers, label: "Full interconnect range" },
          { icon: CircuitBoard, label: "Fine-pitch & SMT-ready" },
          { icon: Wrench, label: "Matched tooling" },
          { icon: Cable, label: "Broad application fit" },
        ]}
        stats={[
          { label: "Parts catalogued", value: cviluxCatalogueProducts.length.toLocaleString() },
          { label: "Product families", value: "9" },
          { label: "Coverage", value: "B2B to I/O" },
          { label: "Origin", value: "Taiwan" },
          { label: "Tooling", value: "Desk-top & hand" },
          { label: "Support", value: "Technical sales" },
        ]}
        primaryCta={{ label: "Request a quote", href: "/contact/quote" }}
        secondaryCta={{ label: "Browse catalogue", href: "#catalogue" }}
        shopUrl="https://www.cvilux.com/products"
      />

      <BrandJumpNav
        items={[
          { label: "Catalogue", href: "#catalogue" },
          { label: "Why Cvilux", href: "#why" },
          { label: "Applications", href: "#applications" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 py-16">
        {/* Filterable, searchable catalogue — same browser as the webshop hubs */}
        <div id="catalogue" className="mb-20 scroll-mt-28">
          <CatalogueProductBrowser
            products={cviluxCatalogueProducts}
            route={cviluxCategory?.route ?? "/products/cvilux"}
            searchParams={{}}
            isWebshopRoot={false}
            sectionLabel="Catalogue"
            sectionTitle="Cvilux catalogue items"
            subcategoryOptions={
              cviluxSubcategoryOptions.length > 0 ? cviluxSubcategoryOptions : undefined
            }
          />
        </div>

        {/* Why Cvilux */}
        <section id="why" className="mb-20 scroll-mt-28">
          <SectionHeader
            eyebrow="Why Cvilux"
            title="The full PCB interconnect path"
            description="From board-to-board and wire-to-board to FFC/FPC and I/O, Cvilux covers the whole connection chain on a modern PCB, with the tooling to terminate it reliably."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <span className="icon-tile mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <h3 className="mb-1.5 font-bold text-[#0a1628]">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[#64748b]">{f.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <BrandApplications title="Where Cvilux connectors are used" applications={applications} />

        <BrandFAQ faqs={faqs} />

        <BrandCTA
          title="Looking for a specific Cvilux series?"
          body="We can source the full Cvilux range, including custom reel quantities and application tooling. Send us your part number or PCB footprint and our technical sales team will respond fast."
        />
      </div>
    </div>
  );
}
