import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Tag } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { absoluteUrl } from "@/lib/seo";
import { deutschOutletComponents } from "@/data/deutschOutlet";
import OutletComponentsClient from "./OutletComponentsClient";

export const metadata: Metadata = {
  title: "Components Outlet | Adcontact",
  description:
    "Surplus Deutsch connector stock from Adcontact's own warehouse, at outlet pricing while quantities last.",
  alternates: { canonical: absoluteUrl("/outlet/components") },
};

export default function ComponentsOutletPage() {
  const skuCount = deutschOutletComponents.length;
  const totalUnits = deutschOutletComponents.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-6">
          <Breadcrumbs
            light
            crumbs={[
              { label: "Outlet", href: "/outlet" },
              { label: "Components Outlet" },
            ]}
          />
          <div className="mt-5 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/[0.08] px-3.5 py-2 text-sm font-semibold text-amber-200">
              <Tag size={16} />
              Sold as-is, while stocks last
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
              Components outlet
            </h1>
            <p className="mt-4 text-base leading-7 text-[#94a3b8]">
              Surplus Deutsch connector stock from our own Bromma warehouse, sold at reduced prices
              while quantities last. Can&apos;t find the part you need below? Tell us what you are
              looking for and we will check what else we have.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">
                  SKUs listed
                </div>
                <div className="text-sm font-semibold text-white">{skuCount}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">
                  Units in stock
                </div>
                <div className="text-sm font-semibold text-white">{totalUnits.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">
                  Brand
                </div>
                <div className="text-sm font-semibold text-white">Deutsch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-6 py-10">
        <OutletComponentsClient />

        <section className="mt-10 rounded-2xl border border-[#e2e8f0] bg-white px-6 py-7 sm:px-8">
          <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">
            Looking for surplus stock on a specific part?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
            This list is a fixed batch from our own stock, it won&apos;t cover everything. Tell us
            the part number, brand or application, and we will check whether it is available
            elsewhere in our outlet stock.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="mailto:info@adcontact.se?subject=Components%20outlet%20enquiry"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              <Mail size={15} />
              Send us your enquiry
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] transition-colors hover:text-[#2563eb]"
            >
              Contact Adcontact
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
