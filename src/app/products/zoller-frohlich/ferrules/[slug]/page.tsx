import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

// Zoller & Fröhlich ferrule categories reproduced internally (product-range
// picture stored in our R2) so visitors stay on our site instead of being sent
// to zofre.de. Add the remaining categories here as they are done.
const ZOFRE_FERRULES = "https://www.zofre.de/en/ferrules";
const WIRE_FERRULES_HUB = "/webshop/components/sealed-connectors/zoller-frohlich.html";

type FerrulePage = {
  title: string;
  image: string; // served from R2 via the /media proxy
  intro: string;
  zofreUrl: string;
};

const FERRULE_PAGES: Record<string, FerrulePage> = {
  "ferrules-on-reel": {
    title: "Ferrules on reel",
    image: "/media/zoller-frohlich/ferrules-on-reel.jpg",
    intro:
      "Insulated wire ferrules from Zoller & Fröhlich supplied on reels for automated and high-volume crimping — including plastic-collar and multi-standard conductor variants.",
    zofreUrl: `${ZOFRE_FERRULES}/ferrules-on-reel`,
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
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
              {page.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#94a3b8]">{page.intro}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-6 py-10">
        {/* Product-range picture */}
        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
          <div className="relative aspect-[16/10] w-full bg-[#f8fafc] sm:aspect-[2/1]">
            <Image
              src={page.image}
              alt={`${page.title} — Zoller & Fröhlich product range`}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1280px"
              className="object-contain p-6 sm:p-10"
            />
          </div>
        </div>

        {/* Sourcing CTA — same as our other brand pages */}
        <section className="mt-10 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-7 sm:px-8">
          <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">Can&apos;t find the exact part?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
            {`We supply the complete Zoller & Fröhlich range, not only what's shown here. Find the exact reference in the Zoller & Fröhlich catalogue, then send it to us and we'll source it for you.`}
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
