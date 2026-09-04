import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, Package, Recycle } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { usedMachines, getModelDescription } from "@/data/usedMachines";
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
            {/* Same template as the Ramatech product-line grid: picture LEFT
                (w-28 / sm:w-40, fills the card height), text RIGHT. */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {usedMachines.map((machine) => {
                const description = getModelDescription(machine.brand, machine.model);
                return (
                  <Link
                    key={machine.slug}
                    href={`/outlet/used-machines/${machine.slug}`}
                    className="group flex min-h-[176px] overflow-hidden rounded-lg border border-[#d8dee7] bg-white transition-all hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
                  >
                    <div className="relative w-28 flex-none bg-white sm:w-40">
                      {machine.photos[0] ? (
                        <Image
                          src={machine.photos[0]}
                          alt={`${machine.brand} ${machine.model}`}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 112px, 160px"
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1 text-[#94a3b8]">
                          <Package size={22} />
                          <span className="text-[10px] font-medium">No photo yet</span>
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
                      <h3 className="text-sm font-bold text-[#0a1628] group-hover:text-[#2563eb] sm:text-base">
                        {machine.brand} {machine.model}
                      </h3>
                      {description && (
                        <p className="mt-1.5 text-[13px] leading-5 text-[#475569]">{description.short}</p>
                      )}
                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#0a1628]">
                          {machine.price ?? "On request"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748b] transition-colors group-hover:text-[#2563eb]">
                          Details
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#f59e0b] px-4 py-2.5 text-sm font-semibold text-[#0a1628] transition-colors hover:bg-[#d97706]"
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
