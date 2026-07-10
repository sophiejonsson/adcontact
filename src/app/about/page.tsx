import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Globe2, Users, Award, MapPin, Cable, Cpu, Wrench } from "lucide-react";
import { industries } from "@/data/industries";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "About Adcontact | Cable Assembly Components & Processing Equipment",
  description:
    "Adcontact supplies connectors, cable assembly components, PCB connectors, wire harness solutions, heat shrink tubing, braided sleeves, and cable processing equipment across Northern Europe and worldwide.",
};

const offices = [
  {
    country: "Estonia · Headquarters",
    company: "Gammeter OÜ",
    address: "Keki tn 6/1",
    city: "76606 Keila, Estonia",
    phone: "+372 671 22 51",
    phoneHref: "tel:+3726712251",
    email: "info@gammeter.ee",
    topics: ["Admin", "Finance", "Company enquiries"],
  },
  {
    country: "Sweden · Sales Office",
    company: "Adcontact AB",
    address: "Ekbacksvägen 22",
    city: "SE-168 69 Bromma, Sweden",
    phone: "+46 (0)8-445 36 00",
    phoneHref: "tel:+46084453600",
    email: "info@adcontact.se",
    topics: ["Sales", "Quotes", "Technical support"],
  },
];

// Condensed for the compact company-history card in the hub header.
// Kept short (one line each) so the header card fits the standard header height.
const milestones = [
  { year: "1985", label: "Founded in Stockholm" },
  { year: "1989", label: "Added wire-processing systems" },
  { year: "1999", label: "ISO 9001 certified" },
  { year: "2009", label: "Acquired Gammeter (Finland, Estonia)" },
  { year: "2017", label: "Estonia distribution centre, now HQ" },
];

// "Why choose us" — the four-step process map (from Business model_landscape.pdf).
// Each step carries its own colour, mirroring the process-map diagram:
// Design = steel/blueprint blue, Production = brass/amber, Quality = signal red,
// Outcome = green (landing on the positive result).
const whySteps = [
  {
    n: "01",
    phase: "Design",
    ring: "#3b6ea5",
    title: "Define the components",
    text: "It starts at the design phase. We select components built for lean production without compromising process reliability, however complex the application. Wherever possible, we favour standard components to open up more options and improve margins and cost efficiency.",
  },
  {
    n: "02",
    phase: "Production",
    ring: "#d97706",
    title: "Engineer production efficiency",
    text: "Adaptable, flexible equipment lets us adjust production quickly as demand shifts. Our commitment to intelligent systems delivers fully automated production, a genuine competitive alternative to outsourcing.",
  },
  {
    n: "03",
    phase: "Quality",
    ring: "#dc2626",
    title: "Safeguard quality",
    text: "Rising demands for cost efficiency, productivity and quality have driven our investment in automated testing and control. Our systems are unique in the market, safeguarding finished-product quality even under tight tolerances.",
  },
  {
    n: "04",
    phase: "Outcome",
    ring: "#16a34a",
    title: "Raise quality, improve profitability",
    text: "Quality isn't just about test equipment, it runs through the entire construction and production chain. Working closely with our engineers from the design phase onward ensures every product meets its specification.",
  },
];

const capabilities = [
  {
    icon: Cable,
    title: "Cable assembly components",
    text: "A complete range of cable connectors, cable accessories, braided sleeves, heat shrink tubing, terminals, contacts, and wire harness components for durable production-ready assemblies.",
  },
  {
    icon: Cpu,
    title: "PCB connector solutions",
    text: "PCB connectors, wire-to-board connectors, contact systems, and related accessories for electronics manufacturing, cable manufacturing, and connector assembly.",
  },
  {
    icon: Wrench,
    title: "Cable processing equipment",
    text: "Cable cutting machines, stripping machines, crimping machines, applicators, bench presses, and production tools for efficient and precise wire processing.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header — dark hub header with the company history moved in */}
      <PageHeader
        crumbs={[{ label: "About us" }]}
        title="About us"
        intro="A trusted supplier over 4 decades providing our market cable assembly products, connectors, accessories and cable processing equipment."
        aside={
          <div className="rounded-2xl border border-[#1e3a6e] bg-[#0f2042] p-4 lg:w-[400px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#60a5fa]">
              Company history
            </p>
            <div className="mt-2.5 space-y-1">
              {milestones.map((m) => (
                <div key={m.year} className="flex items-baseline gap-3">
                  <span className="w-9 flex-shrink-0 font-mono text-xs font-bold text-[#60a5fa]">
                    {m.year}
                  </span>
                  <span className="text-xs leading-snug text-[#cbd5e1]">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* Main content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Left text */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-4">
              A trusted partner for cable assembly manufacturers
            </h2>
            <div className="prose prose-sm text-[#374151] leading-relaxed space-y-4">
              <p>
                We are a trusted supplier in the cable assembly industry, providing a complete range of connectors, cable processing equipment, and accessories for manufacturers worldwide. With a strong focus on cable assemblies, PCB connectors, and wire harness solutions, we support both small- and large-scale production across different industries.
              </p>
              <p>
                Our main market is Northern Europe, but with our partners and logistics network we ensure global coverage. We proudly represent leading brands such as Stocko, TE Connectivity Deutsch connectors, Cvilux, Vogt, Hongshang heat shrink tubing, and JDD Tech braided sleeves, all well-known names in cable manufacturing and PCB assembly.
              </p>
              <p>
                In addition, we supply cable processing machines and equipment designed for efficiency and precision. Our product range includes cable cutting machines, cable stripping machines, crimping machines, applicators, and bench presses from Mecal, Zoller & Fröhlich, Metzner, Ulmer, Ramatech, and Tekuwa, ideal for reliable wire processing and connector assembly.
              </p>
              <p>
                We combine technical expertise, high-quality brands, and fast customer support to deliver the right solutions for every cable assembly manufacturer. Whether you need cable connectors, PCB connectors, braided sleeves, heat shrink tubing, or cable processing tools, we are your partner in creating durable and innovative cable solutions.
              </p>
            </div>
          </div>

          {/* Right stats */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {[
                { icon: Shield, label: "ISO 9001:2015", sub: "Certified quality management" },
                { icon: Globe2, label: "Global coverage", sub: "Customers supplied worldwide" },
                { icon: Users, label: "Technical sales team", sub: "Application support, not just logistics" },
                { icon: Award, label: "40+ years", sub: "Specialist component distribution since 1985" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex gap-4 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                    <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#2563eb]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0a1628]">{item.label}</p>
                      <p className="text-xs text-[#6b7280]">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Why choose us — four-step process map with colour-coded rings and a
            left-to-right timeline (from Business model_landscape.pdf). */}
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
              Why choose us
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#0a1628]">
              Our principle - Four steps every choice of a connector should pass through
            </h2>
          </div>

          <div className="relative">
            {/* Left-to-right timeline line, colour-graded through the four steps,
                running behind the rings (desktop only). */}
            <div
              aria-hidden
              className="absolute left-[12%] right-[12%] top-7 hidden h-0.5 md:block"
              style={{ background: "linear-gradient(to right, #3b6ea5, #d97706, #dc2626, #16a34a)" }}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {whySteps.map((step) => (
                <div key={step.n} className="flex flex-col items-center text-center">
                  {/* Colour-coded ring with the step number */}
                  <div
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 bg-white shadow-sm"
                    style={{ borderColor: step.ring, color: step.ring }}
                  >
                    <span className="text-lg font-extrabold">{step.n}</span>
                  </div>
                  {/* Text box, keeping the general card theme */}
                  <div className="mt-5 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-5 text-left">
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: step.ring }}
                    >
                      {step.phase}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-[#0a1628]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mb-16">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
                What we supply
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#0a1628]">
                Cable assembly products and production equipment
              </h2>
            </div>
            <Link
              href="/webshop.html"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
            >
              Browse catalogue <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#eff6ff]">
                    <Icon size={20} className="text-[#2563eb]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0a1628]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Industries */}
        <div id="industries" className="mb-16 scroll-mt-20">
          <h2 className="text-xl font-bold text-[#0a1628] mb-6">Industries we serve</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry) => (
              <div
                key={industry.id}
                id={industry.slug}
                className="scroll-mt-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-6"
              >
                <h3 className="text-base font-semibold text-[#0a1628] mb-2">{industry.name}</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{industry.shortDescription}</p>
                <h4 className="text-xs font-semibold text-[#374151] mb-2">Typical challenges</h4>
                <ul className="space-y-1">
                  {industry.challenges.map((c) => (
                    <li key={c} className="flex items-start gap-1.5 text-xs text-[#6b7280]">
                      <span className="text-[#2563eb] mt-0.5">→</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Offices */}
        <div>
          <h2 className="text-xl font-bold text-[#0a1628] mb-6">Sales offices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offices.map((office) => (
              <div key={office.country} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#2563eb]" />
                  <h3 className="text-sm font-semibold text-[#0a1628]">{office.country}</h3>
                </div>
                <p className="text-xs text-[#374151] mb-0.5">{office.company}</p>
                <p className="text-xs text-[#6b7280]">{office.address}</p>
                <p className="text-xs text-[#6b7280] mb-3">{office.city}</p>
                <a href={office.phoneHref} className="text-xs text-[#2563eb] hover:underline block mb-0.5">
                  {office.phone}
                </a>
                <a href={`mailto:${office.email}`} className="text-xs text-[#2563eb] hover:underline block mb-3">
                  {office.email}
                </a>
                <div className="flex flex-wrap gap-1">
                  {office.topics.map((topic) => (
                    <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full border border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact CTA */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0a1628] mb-2">Get in touch</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  We supply customers worldwide. Reach us by phone, email, or through our contact form.
                </p>
              </div>
              <Link
                href="/contact/quote"
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
              >
                Contact us <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
