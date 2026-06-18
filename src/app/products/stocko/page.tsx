import {
  Layers,
  Cable,
  Factory,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import BrandHero from "@/components/brand/BrandHero";
import BrandCatalogue from "@/components/brand/BrandCatalogue";
import {
  SectionHeader,
  BrandApplications,
  BrandFAQ,
  BrandCTA,
  BrandJumpNav,
} from "@/components/brand/BrandChrome";
import { stockoProductCount } from "@/data/stockoCatalogue";
import {
  stockoFlatProducts,
  stockoFlatAttributes,
  stockoFlatFilters,
  stockoFlatOverview,
} from "@/data/stockoCatalogueFlat";

const PAGE_URL = "https://www.adcontact.se/products/stocko";

export const metadata: Metadata = {
  title: { absolute: "Stocko Contact Connectors & Terminals | Adcontact" },
  description:
    "Stocko Contact connector systems, crimp contacts, housings, and solderless terminals for automotive, white goods, and industrial electronics. Nordic stocking distributor.",
  alternates: { canonical: PAGE_URL },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.adcontact.se/" },
    { "@type": "ListItem", position: 2, name: "Webshop", item: "https://www.adcontact.se/webshop.html" },
    { "@type": "ListItem", position: 3, name: "Connectors", item: "https://www.adcontact.se/webshop/components/sealed-connectors.html" },
    { "@type": "ListItem", position: 4, name: "Stocko", item: PAGE_URL },
  ],
};


const features = [
  {
    icon: ShieldCheck,
    title: "German precision",
    body: "Stocko Contact has manufactured precision crimp contacts and connector systems in Germany for decades, supplying major European OEMs.",
  },
  {
    icon: Layers,
    title: "Full pitch range",
    body: "Connector systems from 2.5 mm to 11.4 mm pitch, with matching crimp contacts, housings, and pin strips for every layout.",
  },
  {
    icon: Factory,
    title: "Built for volume",
    body: "Designed for reliable, high-throughput assembly in automotive, white goods, and industrial electronics production lines.",
  },
  {
    icon: Cable,
    title: "Complete terminations",
    body: "Crimp contacts, housings, solderless terminals, and splices, so the whole termination is specified and supplied together.",
  },
];

const applications = [
  "White goods and household appliances",
  "Automotive electrical systems",
  "Industrial electronics and controls",
  "Heating, ventilation, and air conditioning",
  "Power tools and garden equipment",
  "Lighting and building technology",
  "Pumps and motor connections",
  "Consumer electronics assembly",
];

const faqs = [
  {
    q: "What does Stocko Contact manufacture?",
    a: "Stocko Contact is a German manufacturer of precision crimp contacts, connector systems, housings, and solderless terminals. Their range covers connector systems from 2.5 mm to 11.4 mm pitch used by automotive, white goods, and industrial electronics OEMs across Europe.",
  },
  {
    q: "Which Stocko product families do you stock?",
    a: "We supply the four core Stocko families: Connector Systems (by pitch), Crimp Contacts, Housings, and Solderless Terminals, each with their respective sub-types. Browse the families above or contact us for a specific part number.",
  },
  {
    q: "Can I get Stocko crimp contacts and housings together?",
    a: "Yes. Stocko housings and their matching crimp contacts are designed as a system. We can supply the housing, the correct crimp contact for your wire gauge, and the recommended tooling so the termination is reliable and repeatable.",
  },
  {
    q: "What pitch sizes are available?",
    a: "Stocko connector systems are available in pitches including 2.5, 2.54, 3.5, 4.2, 5, 5.08, 5.08/7.62, 6.35, 6.5, 8, and 11.4 mm, plus plugs, pin strips, and PCCR variants. Contact us if you are unsure which pitch your application needs.",
  },
  {
    q: "Is Adcontact a Stocko distributor?",
    a: "Adcontact is a Nordic stocking distributor of Stocko Contact connector systems and terminals, with stock in Bromma, Sweden and technical support across the Nordic and Baltic region.",
  },
];

export default function StockoPage() {
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
          { label: "Stocko" },
        ]}
        logo="/images/Stocko.png"
        glow="#e4222b"
        badge="Authorised stocking distributor"
        title="Stocko Contact"
        titleAccent="Connectors & terminals"
        description="German precision crimp contacts, connector systems, housings, and solderless terminals for automotive, white goods, and industrial OEM, with pitches from 2.5 mm to 11.4 mm."
        chips={["Connector Systems", "Crimp Contacts", "Housings", "Solderless Terminals"]}
        specs={[
          { icon: ShieldCheck, label: "German precision" },
          { icon: Layers, label: "2.5–11.4 mm pitch" },
          { icon: Factory, label: "High-volume assembly" },
          { icon: Cable, label: "Complete terminations" },
        ]}
        stats={[
          { label: "Parts catalogued", value: stockoProductCount.toLocaleString() },
          { label: "Product families", value: "4" },
          { label: "Pitch range", value: "2.5–11.4 mm" },
          { label: "Origin", value: "Germany" },
          { label: "Stock", value: "Nordic, Bromma" },
          { label: "Support", value: "Technical sales" },
        ]}
        primaryCta={{ label: "Request a quote", href: "/contact" }}
        secondaryCta={{ label: "Browse families", href: "#catalogue" }}
      />

      <BrandJumpNav
        items={[
          { label: "Families", href: "#overview" },
          { label: "Catalogue", href: "#catalogue-grid" },
          { label: "Why Stocko", href: "#why" },
          { label: "Applications", href: "#applications" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 py-16">
        {/* Overview cards + filterable catalogue */}
        <div className="mb-20">
          <BrandCatalogue
            products={stockoFlatProducts}
            productAttributes={stockoFlatAttributes}
            filterAttributes={stockoFlatFilters}
            overviewCards={stockoFlatOverview}
            overviewAttr="Family"
            overviewEyebrow="Browse by family"
            overviewTitle="Stocko product families"
            overviewIntro={`${stockoProductCount.toLocaleString()} Stocko parts across the families below. Select a family to filter the catalogue, or narrow by sub-category and material.`}
            scrollGroups={["Sub-category", "Material"]}
            productNoun="parts"
          />
        </div>

        {/* Why Stocko */}
        <section id="why" className="mb-20 scroll-mt-28">
          <SectionHeader
            eyebrow="Why Stocko"
            title="Precision crimp systems for volume production"
            description="Stocko Contact's German-engineered connector systems are built for reliable, high-throughput assembly, with the contacts, housings, and terminals to complete every termination."
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
          title="Where Stocko connectors are used"
          applications={applications}
        />

        <BrandFAQ faqs={faqs} />

        <BrandCTA
          title="Need a specific Stocko part number?"
          body="We stock a wide Stocko range and can source the full Stocko Contact catalogue. Send us your part number or drawing and our technical sales team will respond fast."
        />
      </div>
    </div>
  );
}
