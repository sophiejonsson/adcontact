import Link from "next/link";
import {
  ArrowRight,
  Cable,
  Car,
  CircuitBoard,
  Cpu,
  Factory,
  Refrigerator,
  Settings2,
} from "lucide-react";

const paths = [
  {
    eyebrow: "Industrial components",
    title: "Specify the right connection",
    description:
      "Connectors, contacts, heat shrink, ferrules and tooling, matched to your electrical, sealing and environmental needs.",
    href: "/webshop/components.html",
    linkLabel: "Browse components",
    icon: CircuitBoard,
  },
  {
    eyebrow: "Production equipment",
    title: "Build a reliable wire process",
    description:
      "Cutting, stripping, crimping, welding and test equipment, configured to your wire range, volume and quality targets.",
    href: "/webshop/production-equipment.html",
    linkLabel: "Explore equipment",
    icon: Settings2,
  },
];

const industries = [
  { icon: Refrigerator, name: "White Goods & Appliances" },
  { icon: Car, name: "Automotive & Transportation" },
  { icon: Cpu, name: "Electronics Manufacturing" },
  { icon: Cable, name: "Wire Harness Processing" },
  { icon: Factory, name: "Industrial Automation" },
];

export default function ApplicationsSection() {
  return (
    <section className="relative overflow-hidden bg-[#071425] py-12 text-white lg:py-16">
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="pointer-events-none absolute -left-44 -top-40 h-[520px] w-[520px] rounded-full bg-[#2563eb]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-[-160px] h-[520px] w-[520px] rounded-full bg-[#1d4ed8]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-6">
        {/* Header */}
        <div className="mb-7 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60a5fa]">
            How we help
          </p>
          <h2 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] lg:text-[44px]">
            Components and processing equipment, specified together.
          </h2>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Two browsable blocks */}
          <div className="flex flex-col gap-5">
            {paths.map((path) => {
              const Icon = path.icon;
              return (
                <Link
                  key={path.title}
                  href={path.href}
                  className="group flex flex-1 items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563eb]/50 hover:bg-white/[0.07] sm:p-7"
                >
                  <span className="icon-tile-dark flex h-12 w-12 flex-none items-center justify-center rounded-xl">
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#60a5fa]">
                      {path.eyebrow}
                    </p>
                    <h3 className="mt-1 text-xl font-bold tracking-[-0.01em] text-white sm:text-[22px]">
                      {path.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#9fb0c6]">{path.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      {path.linkLabel}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Video, unchanged */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 rounded-[32px] bg-[#2563eb]/15 blur-2xl" />
            <div className="relative h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1c33] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
              <video
                className="aspect-video h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Robotic lawn mower built with Adcontact connectors and wire harness"
              >
                <source src="/lawnmowerrobot.mp4" type="video/mp4" />
              </video>

              {/* Caption overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06101f] via-[#06101f]/40 to-transparent p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 flex-none items-center justify-center">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#34d399]" />
                  </span>
                  <p className="text-xs font-medium text-[#dbe4f0]">
                    Robotic lawn mower · sealed connectors &amp; wire harness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries served */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">
            Trusted across industries
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <div key={ind.name} className="flex flex-col items-center gap-3 px-2 text-center">
                  <span className="icon-tile-dark flex h-12 w-12 flex-none items-center justify-center rounded-xl">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="text-[13px] font-medium leading-snug text-[#9fb0c6]">
                    {ind.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
