import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogueCategoryPage from "@/components/catalogue/CatalogueCategoryPage";
import { getWebshopRootCategory } from "@/lib/magentoCatalogue";
import { absoluteUrl } from "@/lib/seo";

// No dynamic params on this route — force it fully static now that nothing
// here reads searchParams server-side. See webshop/[...path]/page.tsx for
// the full story (2026-07-23 Vercel CPU-duration alert).
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Webshop — Industrial Components & Wire-Processing Equipment";
  const description =
    "Browse Adcontact's full catalogue of connectors, contacts, heat shrink tubing, crimp terminals and wire-processing equipment. Request a quote with expert technical support and fast Nordic delivery.";
  const url = absoluteUrl("/webshop.html");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function WebshopPage() {
  const category = getWebshopRootCategory();
  if (!category) notFound();

  return <CatalogueCategoryPage category={category} />;
}
