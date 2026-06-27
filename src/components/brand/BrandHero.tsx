import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, Phone, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Crumb = { label: string; href?: string };
export type HeroSpec = { icon: LucideIcon; label: string };
export type HeroStat = { label: string; value: string };
export type HeroCta = { label: string; href: string };

type BrandHeroProps = {
  crumbs: Crumb[];
  logo: string;
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  /** Subtle brand-coloured glow in the hero, e.g. "#e4222b". Defaults to steel blue. */
  glow?: string;
  chips?: string[];
  specs: HeroSpec[];
  stats: HeroStat[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  shopUrl?: string;
  /** Optional product/brand image shown in the right panel above the stats. */
  heroImage?: string;
};

export default function BrandHero({
  crumbs,
  logo,
  badge,
  title,
  titleAccent,
  description,
  glow = "#2563eb",
  chips,
  specs,
  stats,
  primaryCta,
  secondaryCta,
  shopUrl,
  heroImage,
}: BrandHeroProps) {
  return (
    <div className="relative overflow-hidden bg-[#0a1628] text-white">
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: glow, opacity: 0.08 }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-[#475569]">
          <Link href="/" className="transition-colors hover:text-white">
            Adcontact
          </Link>
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight size={12} />
              {c.href && i < crumbs.length - 1 ? (
                <Link href={c.href} className="transition-colors hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-[#93c5fd]">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-12 lg:flex-row">
          {/* Left */}
          <div className="max-w-2xl flex-1">
            {/* Logo lockup + badge */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="relative h-11 w-28 flex-none rounded-lg bg-white px-3 py-2">
                <Image
                  src={logo}
                  alt={title}
                  fill
                  sizes="112px"
                  className="object-contain p-1.5"
                  unoptimized
                />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1e3a6e] bg-[#1a2f5a] px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                <span className="text-xs font-medium text-[#fbbf24]">{badge}</span>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight lg:text-5xl">
              {title}
              <span className="mt-2 block text-2xl font-medium text-[#60a5fa] lg:text-3xl">
                {titleAccent}
              </span>
            </h1>

            <p className="mb-6 max-w-xl text-lg leading-relaxed text-[#94a3b8]">
              {description}
            </p>

            {/* Family chips */}
            {chips && chips.length > 0 && (
              <div className="mb-7 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-[#1e3a6e] bg-[#0f2042] px-3 py-1 text-xs font-semibold text-[#93c5fd]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Spec pills */}
            <div className="mb-8 flex flex-wrap gap-3">
              {specs.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-[#1e3a6e] bg-[#0f2042] px-4 py-2"
                >
                  <Icon size={14} className="text-[#2563eb]" />
                  <span className="text-sm text-[#e2e8f0]">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={primaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#0a1628] transition-colors hover:bg-[#d97706]"
              >
                {primaryCta.label}
                <ArrowRight size={15} />
              </a>
              <a
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/15"
              >
                {secondaryCta.label}
                <ArrowRight size={15} />
              </a>
              <a
                href="tel:+46084453600"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a6e] bg-[#1a2f5a] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1e3a6e]"
              >
                <Phone size={14} />
                Technical support
              </a>
            </div>

            {shopUrl && (
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3.5">
                <span className="text-sm text-[#94a3b8]">
                  Can&apos;t find what you&apos;re looking for? Browse the full range directly with the manufacturer.
                </span>
                <a
                  href={shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#fbbf24] hover:text-[#f59e0b] transition-colors"
                >
                  Go to partner shop
                  <ArrowUpRight size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Right: hero image (optional) + stats grid */}
          <div className="flex min-w-[300px] flex-col gap-4 lg:flex-shrink-0">
            {heroImage && (
              <div className="relative w-full overflow-hidden rounded-2xl border border-[#1e3a6e] bg-[#0f2042]" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={heroImage}
                  alt={title}
                  fill
                  unoptimized
                  sizes="420px"
                  className="object-contain p-4"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-[#1e3a6e] bg-[#0f2042] p-4"
                >
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-[#e2e8f0]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
