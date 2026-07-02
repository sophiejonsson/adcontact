import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

// Zoller & Fröhlich ferrule categories reproduced internally (product-range
// pictures, spec tables and copy stored in our R2) so visitors stay on our site
// instead of being sent to zofre.de. Add the remaining categories here as they
// are done — the layout below is fully data-driven.
const ZOFRE_FERRULES = "https://www.zofre.de/en/ferrules";
const WIRE_FERRULES_HUB = "/webshop/components/sealed-connectors/zoller-frohlich.html";
const UL_BADGE = "/media/zoller-frohlich/certificates/ul-certified.jpg";

type Img = { src: string; alt: string };

type FerruleSection = {
  heading: string;
  subheading?: string;
  paragraphs?: string[];
  subsections?: { title: string; paragraphs?: string[]; bullets?: string[] }[];
  rangeChart?: Img & { width: number; height: number };
  productPhoto?: Img;
  ulCertified?: boolean;
  standards?: string[];
};

type FerrulePage = {
  title: string;
  intro: string;
  heroImage: string; // product picture served from R2 via the /media proxy
  zofreUrl: string;
  sections: FerruleSection[];
};

const FERRULE_PAGES: Record<string, FerrulePage> = {
  "ferrules-on-reel": {
    title: "Ferrules on reel",
    heroImage: "/media/zoller-frohlich/ferrules-on-reel.jpg",
    intro:
      "Insulated wire ferrules from Zoller & Fröhlich supplied on reels for automated and high-volume crimping — including plastic-collar and multi-standard conductor variants.",
    zofreUrl: `${ZOFRE_FERRULES}/ferrules-on-reel`,
    sections: [
      {
        heading: "Insulated ferrules on reel",
        subheading: "Ferrules with plastic collar on reel",
        paragraphs: [
          "For conductor cross-sections from 0.34 up to 2.5 mm² (AWG 22 – 14). Material: tin-plated copper. Tolerances according to DIN 46228 part 4.",
        ],
        rangeChart: {
          src: "/media/zoller-frohlich/ferrules-on-reel/range-insulated.svg",
          alt: "Zoller & Fröhlich insulated ferrules on reel — cross-section, AWG, reel diameter, colour code / order number, dimensions and pieces per reel",
          width: 523,
          height: 240,
        },
        productPhoto: {
          src: "/media/zoller-frohlich/ferrules-on-reel.jpg",
          alt: "Zoller & Fröhlich insulated ferrules on reel",
        },
        ulCertified: true,
        standards: ["DIN 46228 part 4"],
      },
      {
        heading: "Ferrules on reel for multi-standard conductors",
        paragraphs: [
          "Z+F has been offering loose ferrules for multi-standard conductors for some time. The ferrules come with an extended plastic collar and allow flexible processing of various conductors. As a world's first, ferrules on reel are now also available for processing multi-standard conductors.",
        ],
        subsections: [
          {
            title: "Cross sections and colours",
            paragraphs: [
              "Available with cross-sections from 0.5 – 2.5 mm² (AWG 20 – 14), crimping lengths from 8 – 10 mm and in the established colours. Customer-specific colours or branding are also available on request — please contact us for details.",
            ],
          },
          {
            title: "Benefits",
            bullets: [
              "Multi-standard ferrules can be processed without a tool change",
              "No need to acquire a new machine",
              "Standard ferrules can still be processed",
            ],
          },
        ],
        rangeChart: {
          src: "/media/zoller-frohlich/ferrules-on-reel/range-multistandard.svg",
          alt: "Zoller & Fröhlich ferrules on reel for multi-standard conductors — cross-section, AWG, reel diameter, colour code / order number, dimensions and pieces per reel",
          width: 523,
          height: 210,
        },
        ulCertified: true,
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(FERRULE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = FERRULE_PAGES[slug];
  if (!page) return {};
  return {
    title: `${page.title} | Zoller & Fröhlich | Adcontact`,
    description: page.intro,
    alternates: { canonical: `/products/zoller-frohlich/ferrules/${slug}` },
  };
}

function Approvals({ ulCertified, standards }: { ulCertified?: boolean; standards?: string[] }) {
  if (!ulCertified && !(standards && standards.length)) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">
        Approvals &amp; standards
      </span>
      {ulCertified && (
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5">
          <Image
            src={UL_BADGE}
            alt="UL certified"
            width={28}
            height={28}
            unoptimized
            className="h-6 w-6 object-contain"
          />
          <span className="text-xs font-semibold text-[#0a1628]">UL certified</span>
        </span>
      )}
      {standards?.map((s) => (
        <span
          key={s}
          className="inline-flex items-center rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#0a1628]"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export default async function ZFerruleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = FERRULE_PAGES[slug];
  if (!page) notFound();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-6">
          <Breadcrumbs
            light
            crumbs={[
              { label: "Webshop", href: "/webshop.html" },
              { label: "Components", href: "/webshop/components.html" },
              { label: "Sealed Connectors", href: "/webshop/components/sealed-connectors.html" },
              { label: "Zoller & Fröhlich", href: WIRE_FERRULES_HUB },
              { label: page.title },
            ]}
          />
          <div className="mt-5">
            <span className="mb-4 inline-flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-2 shadow-sm">
              <Image
                src="/images/partners/zoller-frohlich.png"
                alt="Zoller & Fröhlich"
                width={132}
                height={28}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">{page.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#94a3b8]">{page.intro}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="space-y-12">
          {page.sections.map((section, i) => (
            <section
              key={section.heading}
              className={i > 0 ? "border-t border-[#e5e7eb] pt-12" : undefined}
            >
              <h2 className="text-xl font-bold text-[#0a1628] sm:text-2xl">{section.heading}</h2>
              {section.subheading && (
                <p className="mt-1 text-sm font-semibold text-[#2563eb]">{section.subheading}</p>
              )}

              {/* Description + product photo */}
              <div className="mt-5 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  {section.paragraphs?.map((p) => (
                    <p key={p} className="mb-4 text-sm leading-7 text-[#475569]">
                      {p}
                    </p>
                  ))}
                  {section.subsections?.map((sub) => (
                    <div key={sub.title} className="mt-5">
                      <h3 className="text-sm font-bold text-[#0a1628]">{sub.title}</h3>
                      {sub.paragraphs?.map((p) => (
                        <p key={p} className="mt-2 text-sm leading-7 text-[#475569]">
                          {p}
                        </p>
                      ))}
                      {sub.bullets && (
                        <ul className="mt-2 space-y-1.5">
                          {sub.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm leading-6 text-[#475569]">
                              <Check size={15} className="mt-0.5 flex-none text-[#2563eb]" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  <Approvals ulCertified={section.ulCertified} standards={section.standards} />
                </div>

                {section.productPhoto && (
                  <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
                    <div className="relative aspect-[4/3] w-full bg-[#f8fafc]">
                      <Image
                        src={section.productPhoto.src}
                        alt={section.productPhoto.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 420px"
                        className="object-contain p-6"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Product-range table (vector chart) */}
              {section.rangeChart && (
                <figure className="mt-8">
                  <div className="overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:p-6">
                    <Image
                      src={section.rangeChart.src}
                      alt={section.rangeChart.alt}
                      width={section.rangeChart.width}
                      height={section.rangeChart.height}
                      unoptimized
                      className="mx-auto block h-auto w-full min-w-[560px] max-w-[880px]"
                    />
                  </div>
                  <figcaption className="mt-2 text-xs text-[#94a3b8]">
                    Product range — cross-section, reel diameter, colour code / order number, dimensions and pieces per reel.
                  </figcaption>
                </figure>
              )}
            </section>
          ))}
        </div>

        {/* Sourcing CTA — same as our other brand pages */}
        <section className="mt-12 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-7 sm:px-8">
          <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">Can&apos;t find the exact part?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
            {`We supply the complete Zoller & Fröhlich range, not only what's shown here. Send us the order number or conductor size and we'll source it for you.`}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="mailto:info@adcontact.se?subject=Sourcing%20request%3A%20Zoller%20%26%20Fr%C3%B6hlich"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Send us the part number
              <ArrowRight size={15} />
            </a>
            <a
              href={page.zofreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] transition-colors hover:text-[#2563eb]"
            >
              View Zoller &amp; Fröhlich catalogue
              <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        <div className="mt-8">
          <Link
            href={WIRE_FERRULES_HUB}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2563eb] transition-colors hover:text-[#1d4ed8]"
          >
            <ArrowLeft size={14} />
            Back to Wire Ferrules
          </Link>
        </div>
      </main>
    </div>
  );
}
