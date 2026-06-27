import {
  Droplets,
  Thermometer,
  Shield,
  Cable,
  Truck,
  CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";
import BrandHero from "@/components/brand/BrandHero";
import BrandCatalogue from "@/components/brand/BrandCatalogue";
import {
  SectionHeader,
  BrandJumpNav,
  BrandApplications,
  BrandFAQ,
  BrandCTA,
} from "@/components/brand/BrandChrome";
import teProductsData from "@/data/generated/te-connectivity-products.json";
import {
  teCatalogueProducts,
  teProductAttributes,
  teFilterAttributes,
  teOverviewCards,
} from "@/data/teCatalogue";

const PAGE_URL = "https://www.adcontact.se/products/te-connectivity";

export const metadata: Metadata = {
  title: { absolute: "TE Connectivity Sealed Connectors | AMP | Adcontact" },
  description:
    "TE Connectivity (AMP) sealed connector catalogue. Robust connector housings and components for transportation, industrial equipment, and demanding electrical environments. Nordic stock and fast quotes.",
  alternates: { canonical: PAGE_URL },
};

const TOTAL = teProductsData.length;

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.adcontact.se/" },
    { "@type": "ListItem", position: 2, name: "Webshop", item: "https://www.adcontact.se/webshop.html" },
    { "@type": "ListItem", position: 3, name: "Connectors", item: "https://www.adcontact.se/webshop/components/sealed-connectors.html" },
    { "@type": "ListItem", position: 4, name: "TE Connectivity", item: PAGE_URL },
  ],
};

const features = [
  {
    icon: Droplets,
    title: "Sealed for harsh environments",
    body: "Robust housings engineered to resist moisture, dust, vibration, and temperature extremes in transportation and industrial equipment.",
  },
  {
    icon: Shield,
    title: "Proven AMP reliability",
    body: "TE Connectivity's AMP heritage means decades of field-proven contact systems trusted by OEMs across every major industry.",
  },
  {
    icon: Cable,
    title: "Complete contact systems",
    body: "Matched housings, crimp contacts, and tooling so you can specify a complete, reliable termination from a single source.",
  },
  {
    icon: CheckCircle2,
    title: "Nordic stock & support",
    body: "Held in stock in Bromma with technical sales support and fast quotations across Sweden, Finland, Norway, Denmark, and Estonia.",
  },
];

const applications = [
  "Commercial and passenger vehicles",
  "Off-highway and construction equipment",
  "Industrial machinery and automation",
  "Rail and mass transit",
  "Power distribution and energy",
  "Agricultural equipment",
  "Material handling",
  "Marine and off-shore systems",
  "HVAC and building services",
];

const faqs = [
  {
    q: "What is TE Connectivity AMP?",
    a: "AMP is one of TE Connectivity's flagship connector brands, with a heritage going back to one of the original crimp-contact pioneers. TE's AMP range covers sealed and unsealed connector housings, crimp contacts, and terminals used across automotive, industrial, and transportation applications worldwide.",
  },
  {
    q: "Are TE Connectivity connectors sealed?",
    a: "Many of the TE connector series we stock are environmentally sealed for harsh-environment use, resisting moisture and dust ingress. Sealing ratings vary by series, so contact us with your application and we will confirm the exact IP rating and operating conditions for the part you need.",
  },
  {
    q: "Can I order TE contacts and tooling together?",
    a: "Yes. TE housings, crimp contacts, and the matching application tooling are all available through Adcontact. Ordering the housing, the correct contact for your wire gauge, and the recommended crimp tool together ensures a reliable, repeatable termination.",
  },
  {
    q: "How many TE Connectivity parts does Adcontact stock?",
    a: `Our online TE Connectivity catalogue lists ${TOTAL} parts, and we can source the full TE range beyond that. Send us a part number or specification for pricing and availability.`,
  },
  {
    q: "Is Adcontact a TE Connectivity distributor?",
    a: "Adcontact is a Nordic stocking distributor supplying TE Connectivity AMP connectors, contacts, and tooling, with stock held in Bromma, Sweden and technical support across the Nordic and Baltic region.",
  },
];

export default function TeConnectivityPage() {
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
          { label: "TE Connectivity" },
        ]}
        logo="/images/partners/te-connectivity.svg"
        glow="#ff6900"
        badge="Authorised stocking distributor"
        title="TE Connectivity"
        titleAccent="AMP sealed connectors"
        description="Robust connector housings, contacts, and tooling for transportation, industrial equipment, and demanding electrical environments. The complete AMP range, stocked for the Nordic market."
        specs={[
          { icon: Droplets, label: "Sealed for harsh environments" },
          { icon: Thermometer, label: "Wide temperature range" },
          { icon: Truck, label: "Transportation & industrial" },
          { icon: Shield, label: "Proven AMP reliability" },
        ]}
        stats={[
          { label: "Parts in catalogue", value: TOTAL.toLocaleString() },
          { label: "Brand", value: "TE / AMP" },
          { label: "Application", value: "Transport & industrial" },
          { label: "Sealing", value: "Harsh-environment" },
          { label: "Stock", value: "Nordic, Bromma" },
          { label: "Support", value: "Technical sales" },
        ]}
        primaryCta={{ label: "Request a quote", href: "/contact/quote" }}
        secondaryCta={{ label: `Browse all ${TOTAL.toLocaleString()} products`, href: "#catalogue" }}
        shopUrl="https://www.te.com/en/products/brands.html"
      />

      <BrandJumpNav
        items={[
          { label: "Series overview", href: "#overview" },
          { label: "Catalogue", href: "#catalogue-grid" },
          { label: "Why TE", href: "#why" },
          { label: "Applications", href: "#applications" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 py-16">
        {/* Overview cards + filterable catalogue */}
        <div className="mb-20">
          <BrandCatalogue
            products={teCatalogueProducts}
            productAttributes={teProductAttributes}
            filterAttributes={teFilterAttributes}
            overviewCards={teOverviewCards}
            overviewAttr="Series"
            overviewEyebrow="Browse by series"
            overviewTitle="AMPSEAL connector series"
            overviewIntro="Each card is a complete TE Connectivity series. Select one to filter the catalogue below, or use the filters to narrow by cavities, current rating, connector style and more."
            scrollGroups={["Color", "Material", "No. of cavities"]}
          />
        </div>

        {/* Why TE */}
        <section id="why" className="mb-20 scroll-mt-28">
          <SectionHeader
            eyebrow="Why TE Connectivity"
            title="Field-proven connectors, specified together"
            description="TE Connectivity's AMP systems are engineered for reliability where it matters. We supply the housing, the contact, and the tooling as one complete, supported solution."
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

        <BrandApplications
          title="Where TE Connectivity connectors are used"
          applications={applications}
        />

        <BrandFAQ faqs={faqs} />

        <BrandCTA
          title="Need a TE part or a full quote?"
          body="Our technical sales team in Bromma can confirm the right housing, contact, and tooling for your application. We stock a broad TE Connectivity AMP range and can source the rest fast."
        />
      </div>
    </div>
  );
}
