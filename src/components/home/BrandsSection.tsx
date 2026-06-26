import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brands, type Brand } from "@/data/brands";

// Highlighted manufacturers, in display order (3 tiles per row on desktop):
//   Row 1: Stocko, CviLux, TE Connectivity
//   Row 2: Mecal, Zoller + Fröhlich, Hongshang
// "TE" is stored under the `deutsch` slug (its logo is the TE Connectivity mark).
const HIGHLIGHT_SLUGS = [
  "stocko",
  "cvilux",
  "deutsch",
  "mecal",
  "zoller-frohlich",
  "hongshang",
];

export default function BrandsSection() {
  // Guarantee a complete 6-tile grid: the highlighted brands first (in order),
  // then fill with remaining logos (featured first) to avoid empty cells.
  const withLogo = brands.filter((brand) => brand.logo);
  const lead = HIGHLIGHT_SLUGS.map((slug) =>
    withLogo.find((brand) => brand.slug === slug),
  ).filter((brand): brand is Brand => brand !== undefined);
  const fill = [
    ...withLogo.filter((brand) => brand.featured),
    ...withLogo.filter((brand) => !brand.featured),
  ].filter((brand) => !HIGHLIGHT_SLUGS.includes(brand.slug));
  const featured = [...lead, ...fill].slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-canvas py-10 lg:py-14">
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[#2563eb]/[0.05] blur-3xl" />
      <div className="relative mx-auto max-w-[1440px] px-6">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="eyebrow inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
              Manufacturer network
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-[#0a1628] lg:text-[30px]">
              Established product lines. One technical contact.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#64748b]">
              Adcontact brings leading component and equipment manufacturers into one supported
              sourcing relationship.
            </p>
            <Link
              href="/brands"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]"
            >
              View the complete linecard
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 overflow-hidden rounded-[22px] border border-[#e5eaf0] bg-[#e5eaf0] sm:grid-cols-3">
            {featured.map((brand) => (
              <a
                key={brand.id}
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[80px] items-center justify-center bg-white p-4 transition-colors hover:bg-[#f8fafc]"
                aria-label={`Visit ${brand.name} website`}
              >
                {brand.logo ? (
                  <div className="relative h-9 w-full max-w-[132px] opacity-90 transition-all duration-200 group-hover:opacity-100">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain transition-transform duration-200 group-hover:scale-[1.04]"
                      sizes="132px"
                    />
                  </div>
                ) : (
                  <span className="text-center text-sm font-bold text-[#334155]">
                    {brand.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
