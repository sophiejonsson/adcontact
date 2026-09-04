import type { Metadata } from "next";
import { Tag, Wrench } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { BrandBoxCard } from "@/components/catalogue/CatalogueCategoryPage";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Outlet | Adcontact",
  description:
    "Secondhand cable-processing machines and surplus component stock from Adcontact, at outlet pricing while it lasts.",
  alternates: { canonical: absoluteUrl("/outlet") },
};

// Deutsch's brands.ts logo is the shared TE Connectivity mark (a known latent
// bug flagged wherever brand boxes render) — use the corrected Deutsch mark
// here too, same override CatalogueCategoryPage applies everywhere else.
const DEUTSCH_LOGO = "/media/wysiwyg/infortis/ultimo/category_images/Deutsch.jpg";

// Each outlet sub-section shows one box per brand currently being sold off
// under it. Add a brand here the day it's actually published — e.g. a second
// used-machine brand alongside Komax, or a second components brand alongside
// Deutsch — nothing else about this page needs to change.
const sections = [
  {
    label: "Used machines",
    href: "/outlet/used-machines",
    icon: Wrench,
    description:
      "Secondhand cutting, stripping and crimping machines, sourced through our supplier network. Condition, equipment and specifications listed per machine.",
    brands: [
      // No Komax logo asset in the codebase yet — falls back to the generic
      // box icon until one is sourced, same as any other brand without a logo.
      { label: "Komax", href: "/outlet/used-machines", logo: undefined },
    ],
  },
  {
    label: "Components outlet",
    href: "/outlet/components",
    icon: Tag,
    description:
      "Surplus stock from our own warehouse, at outlet pricing while quantities last. Sold as-is, no returns.",
    brands: [{ label: "Deutsch", href: "/outlet/components", logo: DEUTSCH_LOGO }],
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
          {sections.map(({ label, icon: Icon, description, brands: sectionBrands }) => (
            <div
              key={label}
              className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309]">
                <Icon size={20} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-[#0a1628]">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{description}</p>

              <div className="mt-5 grid gap-3 border-t border-[#f1f5f9] pt-5 sm:grid-cols-2">
                {sectionBrands.map((brand) => (
                  <BrandBoxCard
                    key={brand.href}
                    label={brand.label}
                    href={brand.href}
                    logo={brand.logo}
                    meta="View listing"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
