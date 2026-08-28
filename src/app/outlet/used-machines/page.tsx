import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Recycle } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
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
