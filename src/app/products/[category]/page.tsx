import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getCategoryBySlug, categories } from "@/data/categories";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.name} | Industrial Components`,
    description: cat.description.slice(0, 160),
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  redirect(cat.webshopHref);
}
