import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Globe2, Users, Award, MapPin, Cable, Cpu, Wrench } from "lucide-react";
import { industries } from "@/data/industries";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Adcontact | Cable Assembly Components & Processing Equipment",
  description:
    "Adcontact supplies connectors, cable assembly components, PCB connectors, wire harness solutions, heat shrink tubing, braided sleeves, and cable processing equipment across Northern Europe and worldwide.",
};

const offices = [
  {
    country: "Sweden (HQ)",
    company: "Adcontact AB",
    address: "Ekbacksvägen 22",
    city: "SE-168 69 Bromma",
    phone: "+46 (0)8-445 36 00",
    email: "info@adcontact.se",
  },
];

const milestones = [
  { year: "1985", label: "Founded in Stockholm as specialist component distributor" },
  { year: "1998", label: "Added wire-processing equipment to product portfolio" },
  { year: "2005", label: "Expanded to Finland and Norway markets" },
  { year: "2012", label: "ISO 9001 quality management system certified" },
  { year: "2018", label: "Added Denmark and Estonia to Nordic coverage" },
  { year: "2024", label: "ISO 9001:2015 recertification" },
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
      {/* Header */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <Breadcrumbs crumbs={[{ label: "About" }]} />
          <h1 className="text-3xl font-bold text-[#0a1628] mt-4 mb-2">About Adcontact</h1>
          <p className="text-[#6b7280] text-sm max-w-2xl">
            Trusted supplier of cable assembly products, connectors, accessories, and cable processing equipment. ISO 9001:2015 certified. Active since 1985.
          </p>
        </div>
      </div>

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
                Adcontact is a trusted supplier in the cable assembly industry, providing a complete range of connectors, cable processing equipment, and accessories for manufacturers worldwide. With a strong focus on cable assemblies, PCB connectors, and wire harness solutions, we support both small- and large-scale production across different industries.
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
                { icon: Globe2, label: "5 Nordic markets", sub: "Sweden, Finland, Norway, Denmark, Estonia" },
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

        {/* Quality section */}
        <div id="quality" className="mb-16 scroll-mt-20">
          <div className="bg-[#0a1628] rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 tech-grid opacity-20 rounded-2xl" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-widest mb-3">Quality management</p>
                <h2 className="text-2xl font-bold text-white mb-4">ISO 9001:2015 Certified</h2>
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  Our quality management system is certified to ISO 9001:2015 by an accredited certification body. The scope covers procurement, inventory management, distribution, and technical support of industrial components and production equipment across the Nordic region.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Documented quality processes for procurement and distribution",
                  "Traceability of products from manufacturer to customer",
                  "Customer complaint and NCR management process",
                  "Supplier qualification and audit programme",
                  "Annual management review and continuous improvement",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-sm text-[#94a3b8]">
                    <span className="text-[#2563eb] mt-0.5 flex-shrink-0">✓</span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-[#0a1628] mb-6">Company history</h2>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6 relative">
                {i < milestones.length - 1 && (
                  <div className="absolute left-[47px] top-10 bottom-0 w-px bg-[#e2e8f0]" />
                )}
                <div className="flex-shrink-0 text-right w-16">
                  <span className="text-xs font-mono font-bold text-[#2563eb]">{m.year}</span>
                </div>
                <div className="w-3 h-3 bg-[#2563eb] rounded-full flex-shrink-0 mt-1 relative z-10" />
                <div className="pb-6">
                  <p className="text-sm text-[#374151] leading-relaxed">{m.label}</p>
                </div>
              </div>
            ))}
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
                <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="text-xs text-[#2563eb] hover:underline block mb-0.5">
                  {office.phone}
                </a>
                <a href={`mailto:${office.email}`} className="text-xs text-[#2563eb] hover:underline block">
                  {office.email}
                </a>
              </div>
            ))}

            {/* Contact CTA */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0a1628] mb-2">Get in touch</h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Our technical sales team covers all five Nordic markets. Reach us by phone, email, or through our contact form.
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
