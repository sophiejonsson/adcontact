import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { equipmentCategories } from "@/data/equipment";

type Props = {
  params: Promise<{ slug: string }>;
};

const equipmentCatalogueRoutes: Record<string, string> = {
  "cutting-machines": "/webshop/production-equipment/cutting-machines-for-a-variety-of-materials.html",
  "stripping-machines": "/webshop/production-equipment/stripping-machines.html",
  "crimping-equipment": "/webshop/production-equipment/crimping-equipment.html",
  "ultrasonic-welding": "/webshop/production-equipment/ultrasonic-welding.html",
  "quality-assurance": "/webshop/production-equipment/misc-equipment.html",
  "test-systems": "/webshop/production-equipment/misc-equipment.html",
};

export async function generateStaticParams() {
  return equipmentCategories.map((eq) => ({ slug: eq.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const eq = equipmentCategories.find((e) => e.slug === slug);
  if (!eq) return {};
  return {
    title: `${eq.name} | Production Equipment`,
    description: eq.description,
  };
}

export default async function EquipmentCategoryPage({ params }: Props) {
  const { slug } = await params;
  const eq = equipmentCategories.find((e) => e.slug === slug);
  if (!eq) notFound();

  redirect(equipmentCatalogueRoutes[slug] ?? "/webshop/production-equipment.html");
}
