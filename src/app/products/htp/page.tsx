import {
  Droplets,
  Network,
  Wrench,
  ShieldAlert,
  Cable,
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
import {
  htpProducts,
  htpProductAttributes,
  htpFilterAttributes,
  htpOverviewCards,
} from "@/data/htpCatalogue";

const PAGE_URL = "https://www.adcontact.se/products/htp";

export const metadata: Metadata = {
  title: { absolute: 'HTP Circular Connectors | M8, M12, M23, 7/8" | Adcontact' },
  description:
    'HTP circular connectors: M8, M12 (all codings), M23, 7/8", EN 175301-803, automotive, MIL-C5015, and ATEX types. Nordic stocking distributor for industrial automation.',
  alternates: { canonical: PAGE_URL },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.adcontact.se/" },
    { "@type": "ListItem", position: 2, name: "Webshop", item: "https://www.adcontact.se/webshop.html" },
    { "@type": "ListItem", position: 3, name: "Connectors", item: "https://www.adcontact.se/webshop/components/sealed-connectors.html" },
    { "@type": "ListItem", position: 4, name: "HTP", item: PAGE_URL },
  ],
};


const features = [
  {
    icon: Droplets,
    title: "IP67 / IP68 sealed",
    body: "Sealed against dust and water ingress for reliable connectivity in demanding industrial and outdoor environments.",
  },
  {
    icon: Network,
    title: "All M12 codings",
    body: "A, B, C, D, S, T, and X-coded versions for Profibus, PROFINET, EtherCAT, DeviceNet, and power applications.",
  },
  {
    icon: Wrench,
    title: "Field-wireable",
    body: "Field-assembly versions let you terminate on site without special tooling, alongside moulded cordsets.",
  },
  {
    icon: ShieldAlert,
    title: "ATEX available",
    body: "Hazardous-location versions for Zone 1 and Zone 2 classified environments where certification is required.",
  },
];

const applications = [
  "Factory and process automation",
  "Fieldbus and industrial Ethernet networks",
  "Sensors and actuators",
  "Machine building and robotics",
  "Distribution and I/O boxes",
  "Valve and solenoid control",
  "Hazardous-area installations (ATEX)",
  "Material handling and conveyors",
  "Outdoor and washdown equipment",
];

const faqs = [
  {
    q: "Which connector families does HTP offer?",
    a: 'HTP manufactures circular connectors for industrial automation, including M8, M9, M12, and M23 circular connectors, 7/8" power connectors, EN 175301-803 (DIN 43650) valve connectors, automotive and industrial connectors, distribution boxes, MIL-C5015 style connectors, fuse holders, and accessories.',
  },
  {
    q: "What M12 codings are available?",
    a: "HTP M12 connectors are available in A, B, C, D, S, T, and X codings. A-coding suits sensors and DeviceNet, B-coding Profibus, D-coding PROFINET/EtherCAT (up to 100 Mbit/s), X-coding high-speed Ethernet (up to 10 Gbit/s), and S/T-coding power. Contact us if you are unsure which coding your network requires.",
  },
  {
    q: "Are HTP connectors waterproof?",
    a: "Yes. HTP circular connectors are typically rated IP67, with IP68/IP69K versions available for high-pressure washdown environments. The exact rating depends on the series and whether the connector is mated, so let us know your application.",
  },
  {
    q: "Are field-wireable and ATEX versions available?",
    a: "Yes. HTP offers field-wireable versions for on-site termination without special tooling, as well as moulded cordsets. ATEX-certified versions are available for Zone 1 and Zone 2 hazardous locations.",
  },
  {
    q: "Is Adcontact an HTP distributor?",
    a: "Adcontact is a Nordic stocking distributor of HTP circular connectors, holding M8 and M12 connectors in multiple codings in Bromma, Sweden, with technical support across the Nordic and Baltic region.",
  },
];

export default function HtpPage() {
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
          { label: "HTP" },
        ]}
        logo="/images/htp.jpg"
        glow="#236bb4"
        badge="Authorised stocking distributor"
        title="HTP Connectors"
        titleAccent={'M8 · M12 · M23 · 7/8"'}
        description="Circular connectors for industrial automation and fieldbus. M8, M12 (all codings), M23, 7/8″, EN 175301-803 valve connectors, distribution boxes, and accessories for Profibus, PROFINET, EtherCAT, and DeviceNet."
        chips={["M8", "M12", "M23", '7/8"', "EN 175301", "MIL-C5015", "ATEX"]}
        specs={[
          { icon: Droplets, label: "IP67 / IP68 sealed" },
          { icon: Network, label: "All M12 codings" },
          { icon: Wrench, label: "Field-wireable" },
          { icon: ShieldAlert, label: "ATEX versions" },
        ]}
        stats={[
          { label: "Connector families", value: "14" },
          { label: "Key series", value: "M8 / M12 / M23" },
          { label: "Sealing", value: "IP67 / IP68" },
          { label: "Networks", value: "Profibus / PROFINET" },
          { label: "Stock", value: "Nordic, Bromma" },
          { label: "Support", value: "Technical sales" },
        ]}
        primaryCta={{ label: "Request a quote", href: "/contact/quote" }}
        secondaryCta={{ label: "Browse families", href: "#overview" }}
        shopUrl="https://www.webhtp.eu/"
      />

      <BrandJumpNav
        items={[
          { label: "Families", href: "#overview" },
          { label: "Catalogue", href: "#catalogue-grid" },
          { label: "Why HTP", href: "#why" },
          { label: "Applications", href: "#applications" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 py-16">
        {/* Overview cards + filterable catalogue */}
        <div className="mb-20">
          <BrandCatalogue
            products={htpProducts}
            productAttributes={htpProductAttributes}
            filterAttributes={htpFilterAttributes}
            overviewCards={htpOverviewCards}
            overviewAttr="Family"
            overviewEyebrow="Browse by family"
            overviewTitle="HTP connector families"
            overviewIntro={`${htpProducts.length.toLocaleString()} HTP parts across the families below. Select a family to filter the catalogue, or narrow by sub-category.`}
            scrollGroups={["Sub-category"]}
          />
        </div>

        {/* Why HTP */}
        <section id="why" className="mb-20 scroll-mt-28">
          <SectionHeader
            eyebrow="Why HTP"
            title="Sealed connectivity for automation"
            description="HTP circular connectors keep signal, data, and power flowing reliably across the factory floor, from sealed sensors to high-speed industrial Ethernet."
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

        <BrandApplications title="Where HTP connectors are used" applications={applications} />

        <BrandFAQ faqs={faqs} />

        <BrandCTA
          title="Need a specific HTP part or custom cordset?"
          body="We stock M8 and M12 connectors in multiple codings and can source the full HTP range, including field-wireable, moulded, and ATEX versions. Tell us your application and we will specify it with you."
        />
      </div>
    </div>
  );
}
