import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Tag, Wrench } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Outlet | Adcontact",
  description:
    "Secondhand cable-processing machines and surplus component stock from Adcontact, at outlet pricing while it lasts.",
  alternates: { canonical: absoluteUrl("/outlet") },
};

const sections = [
  {
    label: "Used machines",
    href: "/outlet/used-machines",
    icon: Wrench,
    description:
      "Secondhand cutting, stripping and crimping machines, sourced through our supplier network. Condition, equipment and specifications listed per machine.",
  },
  {
    label: "Components outlet",
    href: "/outlet/components",
    icon: Tag,
    description:
      "Surplus stock from our own warehouse, at outlet pricing while quantities last. Sold as-is, no returns.",
  },
];

export default function OutletPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        crumbs={[{ label: "Outlet" }]}
        title="Outlet"
        intro="Secondhand machines and surplus component stock, at outlet pricing while it lasts."
      />

      <main className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {sections.map(({ label, href, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-[#f59e0b] hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.35)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309]">
                <Icon size={20} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-[#0a1628] group-hover:text-[#b45309]">
                {label}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#475569]">{description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#b45309]">
                Browse
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
