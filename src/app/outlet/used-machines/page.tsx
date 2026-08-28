import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Package, Recycle } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { usedMachines } from "@/data/usedMachines";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Used Machines | Outlet | Adcontact",
  description:
    "Second-hand cable-processing machines from Adcontact. We are building our used-machine offering for the Nordic market. Tell us what you are looking for and we will help you source it.",
  alternates: { canonical: absoluteUrl("/outlet/used-machines") },
};

export default function UsedMachinesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-6">
          <Breadcrumbs
            light
            crumbs={[
              { label: "Outlet", href: "/outlet" },
              { label: "Used Machines" },
            ]}
          />
          <div className="mt-5 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/[0.08] px-3.5 py-2 text-sm font-semibold text-amber-200">
              <Recycle size={16} />
              Coming soon
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">Used machines</h1>
            <p className="mt-4 text-base leading-7 text-[#94a3b8]">
              We are starting up our second-hand machine offering for the Nordic market. The
              selection will vary a lot, from cutting and stripping machines to crimping presses and
              complete production lines. Each listing will show condition, equipment and full
              specifications. If you are looking for a specific used machine, or have a machine to
              sell, tell us and we will help.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-6 py-10">
        {usedMachines.length > 0 && (
          <section className="mb-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#b45309]">
              Template preview — not yet ready for customers
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {usedMachines.map((machine) => (
                <Link
                  key={machine.slug}
                  href={`/outlet/used-machines/${machine.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition-all hover:-translate-y-0.5 hover:border-[#f59e0b] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
                >
                  <div className="relative aspect-square w-full bg-[#f8fafc]">
                    {machine.photos[0] ? (
                      <Image
                        src={machine.photos[0]}
                        alt={`${machine.brand} ${machine.model}`}
                        fill
                        unoptimized
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1.5 text-[#94a3b8]">
                        <Package size={28} />
                        <span className="text-xs font-medium">No photo yet</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-bold text-[#0a1628] group-hover:text-[#b45309]">
                      {machine.brand} {machine.model}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-[#64748b]">S/N {machine.serialNumber}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-sm font-semibold text-[#0a1628]">
                        {machine.price ?? "On request"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#b45309]">
                        Details
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-[#e2e8f0] bg-white px-6 py-7 sm:px-8">
          <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">
            Looking for a used machine, or selling one?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#475569]">
            Tell us the machine type, brand or application you need, or the machine you want to
            sell, and we will match it to our network across the Nordics.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="mailto:info@adcontact.se?subject=Used%20machines%20enquiry"
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
