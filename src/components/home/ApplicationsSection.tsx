import Link from "next/link";
import {
  ArrowRight,
  Cable,
  Car,
  CircuitBoard,
  Cpu,
  Factory,
  Flame,
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
  { icon: Flame, name: "Heating Industry" },
];

export default function ApplicationsSection() {
  return (
    <section className="relative overflow-hidden bg-[#071425] py-8 sm:py-12 md:py-14 lg:py-16 text-white">
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="pointer-events-none absolute -left-32 sm:-left-44 -top-32 sm:-top-40 h-[300px] w-[300px] sm:h-[520px] sm:w-[520px] rounded-full bg-[#2563eb]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 sm:-right-40 bottom-[-100px] sm:bottom-[-160px] h-[300px] w-[300px] sm:h-[520px] sm:w-[520px] rounded-full bg-[#1d4ed8]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60a5fa]">
            How we help
          </p>
          <h2 className="mt-2 sm:mt-3 text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-extrabold leading-[1.1] sm:leading-[1.08] tracking-[-0.02em] sm:tracking-[-0.03em]">
            Components and processing equipment, specified together.
          </h2>
        </div>

        <div className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Two browsable blocks */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {paths.map((path) => {
              const Icon = path.icon;
              return (
                <Link
                  key={path.title}
                  href={path.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-1 items-start gap-3 sm:gap-5 rounded-[16px] sm:rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6 md:p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563eb]/50 hover:bg-white/[0.07]"
                >
                  <span className="icon-tile-dark flex h-10 w-10 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-lg sm:rounded-xl">
                    <Icon size={18} className="sm:w-[22px]" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#60a5fa]">
                      {path.eyebrow}
                    </p>
                    <h3 className="mt-1 text-base sm:text-xl md:text-[22px] font-bold tracking-[-0.01em] text-white">
                      {path.title}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-[#9fb0c6]">{path.description}</p>
                    <span className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
                      {path.linkLabel}
                      <ArrowRight
                        size={14}
                        className="sm:w-4 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Video, optimized for mobile */}
          <div className="relative min-h-[240px] sm:min-h-[360px]">
            <div className="pointer-events-none absolute -inset-3 sm:-inset-4 rounded-[24px] sm:rounded-[32px] bg-[#2563eb]/15 blur-2xl" />
            <div className="relative h-full overflow-hidden rounded-[16px] sm:rounded-[24px] border border-white/10 bg-[#0b1c33] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
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
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06101f] via-[#06101f]/40 to-transparent p-3 sm:p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 flex-none items-center justify-center">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-pulse rounded-full bg-[#34d399]" />
                  </span>
                  <p className="text-[11px] sm:text-xs font-medium text-[#dbe4f0]">
                    Robotic lawn mower · sealed connectors &amp; wire harness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries served */}
        <div className="mt-6 sm:mt-8 border-t border-white/10 pt-5 sm:pt-6">
          <p className="mb-4 sm:mb-5 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#64748b]">
            Trusted across industries
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-5 sm:grid-cols-3 lg:grid-cols-5 px-2 sm:px-0">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              const isLonelyLast =
                i === industries.length - 1 && industries.length % 2 === 1;
              return (
                <div
                  key={ind.name}
                  className={`flex flex-col items-center gap-2 sm:gap-3 px-1 text-center ${
                    isLonelyLast ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <span className="icon-tile-dark flex h-9 w-9 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-lg sm:rounded-xl">
                    <Icon size={16} className="sm:w-5" strokeWidth={1.8} />
                  </span>
                  <span className="text-[11px] sm:text-[13px] font-medium leading-snug text-[#9fb0c6]">
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
