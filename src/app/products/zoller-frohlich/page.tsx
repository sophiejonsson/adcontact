import {
  Scissors,
  Zap,
  Settings,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import BrandHero from "@/components/brand/BrandHero";
import {
  SectionHeader,
  BrandApplications,
  BrandFAQ,
  BrandCTA,
  BrandJumpNav,
} from "@/components/brand/BrandChrome";

const PAGE_URL = "https://www.adcontact.se/products/zoller-frohlich";

export const metadata: Metadata = {
  title: { absolute: "Zoller + Fröhlich Wire-Processing Machines | Adcontact" },
  description:
    "Zoller + Fröhlich (Z+F) wire-processing machines: cutting and stripping machines, crimping presses, and multi-wire processing centers for harness production. Nordic sales and support.",
  alternates: { canonical: PAGE_URL },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.adcontact.se/" },
    { "@type": "ListItem", position: 2, name: "Webshop", item: "https://www.adcontact.se/webshop.html" },
    { "@type": "ListItem", position: 3, name: "Production Equipment", item: "https://www.adcontact.se/webshop/production-equipment.html" },
    { "@type": "ListItem", position: 4, name: "Zoller + Fröhlich", item: PAGE_URL },
  ],
};

const features = [
  {
    icon: Scissors,
    title: "Cut & strip machines",
    body: "Fully automatic cutting and stripping machines with programmable strip lengths, depths, and dimensions for single and multi-layer conductors.",
  },
  {
    icon: Zap,
    title: "High-throughput automation",
    body: "Engineered for high-volume wire harness production, minimising cycle times without compromising precision or repeatability.",
  },
  {
    icon: Settings,
    title: "Servo-driven precision",
    body: "Digital control systems and servo drives deliver consistent crimp force and strip quality across every cycle, shift, and batch.",
  },
  {
    icon: ShieldCheck,
    title: "Integrated quality control",
    body: "Built-in crimp-force monitoring and quality tracking help detect issues in real time, keeping rejects low and output reliable.",
  },
];

const productRanges = [
  {
    title: "Stripping Machines",
    count: 6,
    description:
      "Bench-top and inline stripping machines for coaxial, multi-layer, and standard round conductors. Precise strip depth and length control, suitable for manual and automated lines.",
    href: "/webshop/production-equipment/stripping-machines/zoller-frohlich.html",
    label: "Browse stripping machines",
  },
  {
    title: "Crimping Presses",
    count: 27,
    description:
      "Eccentric, toggle, and servo-driven crimp presses with interchangeable applicator systems. Suitable for a full range of terminal types, from micro to power applications.",
    href: "/webshop/production-equipment/crimping-equipment/zoller-frohlich.html",
    label: "Browse crimping presses",
  },
];

const applications = [
  "Automotive wire harness manufacturing",
  "Aerospace cable assemblies",
  "Industrial control panel wiring",
  "Railway and rolling-stock cabling",
  "Medical device cable assembly",
  "E-mobility and renewable energy",
  "Commercial vehicle and off-highway",
  "Marine and offshore installations",
];

const faqs = [
  {
    q: "What machines does Zoller + Fröhlich manufacture?",
    a: "Zoller + Fröhlich (Z+F) produces a range of wire-processing machines including fully automatic cut-and-strip machines, bench-top stripping machines for coaxial and multi-layer conductors, eccentric and servo-driven crimping presses, and applicator systems. Their equipment is used by wire harness manufacturers in automotive, aerospace, and industrial markets worldwide.",
  },
  {
    q: "What is the difference between a stripping machine and a crimping press?",
    a: "A stripping machine removes insulation from the conductor ends to a precise depth and length. A crimping press then applies a crimp terminal to the stripped conductor end under controlled force. Z+F supplies both, and they are often used together in an automated or semi-automatic wire-processing line.",
  },
  {
    q: "Can I get Z+F applicators and accessories through Adcontact?",
    a: "Yes. In addition to the main press and machine units, we can supply Z+F applicators, tooling, and accessories. Contact us with your terminal type and machine model and we will confirm the right applicator specification and availability.",
  },
  {
    q: "How do I get a quote for a Zoller + Fröhlich machine?",
    a: "Use the contact form or email us at info@adcontact.se with details of your application — wire type, gauge range, terminal series, and target throughput — and our technical sales team will come back with pricing and lead time.",
  },
  {
    q: "Is Adcontact a Zoller + Fröhlich distributor?",
    a: "Adcontact sells and supports Zoller + Fröhlich wire-processing machines for the Nordic and Baltic markets. We provide pre-sales consultation, quotations, and can arrange installation and after-sales support.",
  },
];

export default function ZollerFrohlichPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <BrandHero
        crumbs={[
          { label: "Webshop", href: "/webshop.html" },
          { label: "Production Equipment", href: "/webshop/production-equipment.html" },
          { label: "Zoller + Fröhlich" },
        ]}
        logo="/images/partners/zoller-frohlich.png"
        glow="#c0392b"
        badge="Authorised partner"
        title="Zoller + Fröhlich"
        titleAccent="Wire-processing machines & crimp presses"
        description="Zoller + Fröhlich (Z+F) manufactures fully automatic cutting and stripping machines, crimp presses, and multi-wire processing centers for high-precision wire harness production. Used by automotive, aerospace, and industrial manufacturers worldwide."
        specs={[
          { icon: Scissors, label: "Cut & strip machines" },
          { icon: Zap, label: "High-throughput automation" },
          { icon: Settings, label: "Servo-driven precision" },
          { icon: ShieldCheck, label: "Integrated quality control" },
        ]}
        stats={[
          { label: "Products in catalogue", value: "33" },
          { label: "Machine types", value: "Stripping & crimping" },
          { label: "Application", value: "Wire harness production" },
          { label: "Industries", value: "Auto, aero, industrial" },
          { label: "Origin", value: "Germany" },
          { label: "Support", value: "Nordic & Baltic" },
        ]}
        primaryCta={{ label: "Request a quote", href: "/contact/quote" }}
        secondaryCta={{ label: "Browse all 33 products", href: "#range" }}
        shopUrl="https://www.zofre.de/en/"
      />

      <BrandJumpNav
        items={[
          { label: "Product range", href: "#range" },
          { label: "Why Z+F", href: "#why" },
          { label: "Applications", href: "#applications" },
          { label: "FAQ", href: "#faq" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 py-16">

        {/* Product range */}
        <section id="range" className="mb-20 scroll-mt-28">
          <SectionHeader
            eyebrow="Product range"
            title="Stripping machines & crimping presses"
            description="Browse the two Zoller + Fröhlich product families we supply. Each line in the webshop is a machine or press with full technical specifications and availability on request."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {productRanges.map((range) => (
              <Link
                key={range.href}
                href={range.href}
                className="group flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-6 transition-shadow hover:border-[#93c5fd] hover:shadow-md"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg font-bold text-[#0a1628]">{range.title}</span>
                  <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-xs font-semibold text-[#2563eb]">
                    {range.count} products
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{range.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] group-hover:text-[#1d4ed8]">
                  {range.label} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Z+F */}
        <section id="why" className="mb-20 scroll-mt-28">
          <SectionHeader
            eyebrow="Why Zoller + Fröhlich"
            title="Precision automation for wire processing"
            description="Z+F machines are built for the demands of modern harness manufacturing — high throughput, tight tolerances, and process reliability from the first cycle to the millionth."
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
          title="Where Zoller + Fröhlich machines are used"
          applications={applications}
        />

        <BrandFAQ faqs={faqs} />

        <BrandCTA
          title="Need a Z+F machine or a quote?"
          body="Our technical sales team can advise on the right stripping machine or crimping press for your wire type, terminal series, and production volume. Contact us for pricing and lead time."
        />
      </div>
    </div>
  );
}
