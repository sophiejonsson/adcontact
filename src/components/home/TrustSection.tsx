import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Cable,
  Factory,
  Globe2,
  ScanSearch,
} from "lucide-react";

const proofPoints = [
  {
    value: "Since 1985",
    label: "Specialist industrial experience",
  },
  {
    value: "Global",
    label: "Customers supplied worldwide",
  },
  {
    value: "One partner",
    label: "Components, tooling and production equipment",
  },
];

const buyerBenefits = [
  {
    icon: ScanSearch,
    title: "Confident component selection",
    description:
      "Application support helps your team verify specifications, mating parts and product compatibility before ordering.",
  },
  {
    icon: Cable,
    title: "Support beyond the part number",
    description:
      "Specialists connect components with the correct contacts, tooling, accessories and production process.",
  },
  {
    icon: Factory,
    title: "One view of the production line",
    description:
      "Source interconnect components and wire-processing equipment from a team that understands how they work together.",
  },
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-[#071425] py-12 text-white lg:py-16">
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="absolute -right-40 -top-52 h-[560px] w-[560px] rounded-full bg-[#2563eb]/10 blur-3xl" />
      <div className="absolute -left-48 bottom-[-120px] h-[480px] w-[480px] rounded-full bg-[#1d4ed8]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow mb-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-[#60a5fa]">
              Why Adcontact
            </p>
            <h2 className="max-w-xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] lg:text-[44px]">
              Confidence, built into every order.
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-7 text-[#9fb0c6] lg:justify-self-end">
            Industrial sourcing is not only about finding a part. It is about knowing that the
            specification is right, the supply route is dependable, and knowledgeable support is
            available when the application gets complicated.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="overflow-hidden rounded-[28px] bg-white text-[#0a1628] shadow-[0_28px_70px_-30px_rgba(0,0,0,0.7)]">
            <div className="grid min-h-full sm:grid-cols-[0.72fr_1fr]">
              <a
                href="/images/0035375_ENG_Adcontact_AB.png"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative min-h-[240px] overflow-hidden bg-[#f5f7fa] sm:min-h-[320px]"
                aria-label="Open the Adcontact ISO 9001:2015 certificate"
              >
                <Image
                  src="/images/0035375_ENG_Adcontact_AB.png"
                  alt="Adcontact AB ISO 9001:2015 certificate issued by Intertek"
                  fill
                  className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 30vw"
                />
              </a>

              <div className="flex flex-col justify-center p-5 sm:p-7">
                <span className="icon-tile mb-6 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <BadgeCheck size={24} strokeWidth={1.8} />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
                  Intertek certified
                </p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.025em]">
                  ISO 9001:2015
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#64748b]">
                  Certified quality management for the sale of components and production
                  equipment for the electronics industry.
                </p>

                <dl className="mt-6 space-y-3 border-t border-[#e5eaf0] pt-6 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#94a3b8]">Certificate</dt>
                    <dd className="font-semibold">0035375</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#94a3b8]">Valid until</dt>
                    <dd className="font-semibold">12 October 2027</dd>
                  </div>
                </dl>

                <a
                  href="/images/0035375_ENG_Adcontact_AB.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#2563eb]"
                >
                  View certificate
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] sm:grid-cols-3">
              {proofPoints.map((point, index) => (
                <div
                  key={point.value}
                  className={`p-6 sm:p-7 ${
                    index
                      ? "border-t border-white/10 sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-xl font-bold tracking-[-0.025em] text-white">
                    {point.value}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#8395ad]">{point.label}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1c33] p-5 sm:p-6">
              <div className="mb-6 flex items-center gap-2.5">
                <Globe2 size={15} className="text-[#60a5fa]" strokeWidth={2} />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60a5fa]">
                  What this means for your team
                </p>
              </div>

              <div>
                {buyerBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.title}
                      className={`grid gap-3 py-4 sm:grid-cols-[44px_1fr] ${
                        index ? "border-t border-white/10" : "pt-0"
                      }`}
                    >
                      <span className="icon-tile-dark flex h-11 w-11 items-center justify-center rounded-xl">
                        <Icon size={19} strokeWidth={1.8} />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">
                          {benefit.title}
                        </h3>
                        <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-[#8395ad]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:text-left">
                <Link
                  href="/about#quality"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-colors hover:bg-[#eff6ff]"
                >
                  Our quality approach
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/contact/quote"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#93c5fd] transition-colors hover:text-white"
                >
                  Talk to a specialist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
