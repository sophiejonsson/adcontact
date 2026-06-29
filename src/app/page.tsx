import type { Metadata } from "next";
import HeroSearch from "@/components/home/HeroSearch";
import BrandsCarousel from "@/components/home/BrandsCarousel";
import ApplicationsSection from "@/components/home/ApplicationsSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Adcontact | Industrial Components & Wire-Processing Solutions",
  description:
    "Nordic specialist distributor of industrial electromechanical components, connectors, heat shrink tubing, crimp contacts, and wire-processing production equipment. TE Connectivity, Deutsch, Stocko.",
};

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <BrandsCarousel />
      <ApplicationsSection />
      <CTASection />
    </>
  );
}
