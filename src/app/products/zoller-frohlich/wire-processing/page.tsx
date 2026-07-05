import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

// Zoller & Fröhlich production-equipment (stripping & crimping) landing. Their
// equipment catalogue is legacy/EOL and they maintain a current site, so this is
// a lean reference: header + one link box redirecting to zofre.de. Reuses the
// same application photo as the components Z&F hub.
const ZOFRE = "https://www.zofre.de/";
const HEADER_IMAGE = "/media/zoller-frohlich/ferrules-application.jpg";

export const metadata: Metadata = {
  title: "Zoller & Fröhlich wire processing | Adcontact",
  description:
    "With Z+F's wide product range there is a right solution for every connection problem: ferrules, tools and machines for many different applications.",
  alternates: { canonical: "/products/zoller-frohlich/wire-processing" },
};

export default function ZFWireProcessingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero — text left, application photo right */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-6">
          <Breadcrumbs
            light
            crumbs={[
              { label: "Webshop", href: "/webshop.html" },
              { label: "Production Equipment", href: "/webshop/production-equipment.html" },
              { label: "Zoller & Fröhlich wire processing" },
            ]}
          />
          <div className="mt-5 grid items-center gap-8 lg:grid-cols-2">
            <div>
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
                Zoller &amp; Fröhlich wire processing
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#94a3b8]">
                With Z+F&apos;s wide product range there is a right solution for every connection
                problem: ferrules, tools and machines for many different applications. Furthermore
                Z+F offers control panels and laser measurement technology.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg lg:w-[420px]">
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={HEADER_IMAGE}
                    alt="Zoller & Fröhlich wire processing"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single link box — image left, text right — redirecting to Z+F */}
      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <a
          href={ZOFRE}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)] sm:flex-row"
        >
          <div className="relative aspect-[16/10] w-full flex-none bg-[#f8fafc] sm:aspect-auto sm:w-72 lg:w-96">
            <Image
              src={HEADER_IMAGE}
              alt="Zoller & Fröhlich"
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
            <div className="space-y-3 text-sm leading-6 text-[#475569]">
              <p>
                Z+F strives to continuously improve their technology with continual support and
                feedback from clients and is renowned for its friendliness, easy approach, quality
                and understanding of its clients&apos; needs. Through these automated machines, in
                conjunction with ferrules and pin contacts, every crimp guarantees a perfect
                connection with a high mechanical load.
              </p>
              <p>
                The broad range of Z+F machines allows the processing of loose insulated and
                uninsulated ferrules as well as turned pin contacts. Twin ferrules and ferrules on
                reel can also be processed, providing robust and efficient handling.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] transition-colors group-hover:text-[#1d4ed8]">
              Visit Zoller &amp; Fröhlich
              <ArrowUpRight size={15} />
            </span>
          </div>
        </a>
      </main>
    </div>
  );
}
