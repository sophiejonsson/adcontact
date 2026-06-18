import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "@/data/featuredProducts";

const leadProduct = featuredProducts[0];
const supportingProducts = [
  featuredProducts[1],
  featuredProducts[2],
  featuredProducts[6],
  featuredProducts[9],
];

export default function FeaturedProducts() {
  return (
    <section className="relative overflow-hidden bg-canvas-alt py-12 lg:py-16">
      <div className="dot-overlay pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[440px] w-[440px] rounded-full bg-[#2563eb]/[0.05] blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-6">
        <div className="mb-7 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-[#2563eb]">
              Selected products
            </p>
            <h2 className="text-[34px] font-extrabold leading-[1.08] text-[#0a1628] lg:text-[44px]">
              Featured products
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#64748b]">
              Representative equipment and components from the Adcontact webshop.
            </p>
          </div>
          <Link
            href="/webshop.html"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#dbe3ee] bg-white px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:border-[#2563eb] hover:text-[#2563eb] hover:shadow-sm"
          >
            View all featured products
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          <Link
            href={leadProduct.href}
            className="group relative flex min-h-[360px] overflow-hidden rounded-[28px] bg-[#0a1628] p-6 sm:p-8 lg:min-h-[440px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(37,99,235,0.24),transparent_42%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#06101f] via-[#0a1628]/60 to-transparent" />

            <div className="absolute inset-x-8 top-8 bottom-40 sm:inset-x-14 sm:top-12 sm:bottom-44">
              <Image
                src={leadProduct.image}
                alt={leadProduct.name}
                fill
                className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)] transition-transform duration-700 group-hover:scale-[1.035]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                priority
              />
            </div>

            <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-5">
              <div>
                <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#bfdbfe] backdrop-blur-sm">
                  Production equipment
                </span>
                <h3 className="max-w-md text-2xl font-bold text-white sm:text-3xl">
                  {leadProduct.name}
                </h3>
                <p className="mt-2 text-sm text-[#94a3b8]">
                  Built for precise, repeatable wire processing.
                </p>
              </div>
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white text-[#0a1628] transition-transform group-hover:translate-x-1">
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>

          <div className="grid gap-5 sm:grid-cols-2">
            {supportingProducts.map((product, index) => (
              <Link
                key={product.href}
                href={product.href}
                className="group flex min-h-[200px] flex-col overflow-hidden rounded-[24px] border border-[#e5eaf0] bg-[#f8fafc] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#bfdbfe] hover:bg-white hover:shadow-[0_18px_45px_-20px_rgba(15,23,42,0.28)] sm:min-h-0"
              >
                <div className="relative min-h-0 flex-1">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
                <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#e5eaf0] pt-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">
                      {index < 2 ? "Equipment" : "Component"}
                    </p>
                    <h3 className="text-sm font-bold leading-5 text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
                      {product.name}
                    </h3>
                  </div>
                  <ArrowRight
                    size={16}
                    className="mb-0.5 flex-none text-[#94a3b8] transition-all group-hover:translate-x-0.5 group-hover:text-[#2563eb]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
