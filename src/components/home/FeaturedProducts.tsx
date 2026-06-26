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

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-5 sm:mb-7 md:mb-8 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl flex-1">
            <p className="eyebrow mb-2 sm:mb-3 inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#2563eb]">
              Selected products
            </p>
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-extrabold leading-[1.1] sm:leading-[1.08] text-[#0a1628]">
              Featured products
            </h2>
            <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-[15px] leading-6 sm:leading-7 text-[#64748b]">
              Representative equipment and components from the Adcontact webshop.
            </p>
          </div>
          <Link
            href="/webshop.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-full sm:w-fit items-center justify-center sm:justify-start gap-2 rounded-lg sm:rounded-full border border-[#dbe3ee] bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#0a1628] transition-all hover:border-[#2563eb] hover:text-[#2563eb] hover:shadow-sm min-h-[44px] sm:min-h-auto mt-3 lg:mt-0"
          >
            View all featured products
            <ArrowRight
              size={14}
              className="sm:w-[15px] transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          <Link
            href={leadProduct.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[320px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[440px] overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#0a1628] p-4 sm:p-6 md:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(37,99,235,0.24),transparent_42%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#06101f] via-[#0a1628]/60 to-transparent" />

            <div className="absolute inset-x-4 top-4 bottom-32 sm:inset-x-8 sm:top-6 sm:bottom-40 md:inset-x-10 md:top-8 md:bottom-44">
              <Image
                src={leadProduct.image}
                alt={leadProduct.name}
                fill
                className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)] transition-transform duration-700 group-hover:scale-[1.035]"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                priority
              />
            </div>

            <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-3 sm:gap-5">
              <div className="min-w-0">
                <span className="mb-2 sm:mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[#bfdbfe] backdrop-blur-sm">
                  Production equipment
                </span>
                <h3 className="max-w-md text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  {leadProduct.name}
                </h3>
                <p className="hidden sm:block mt-2 text-sm text-[#94a3b8]">
                  Built for precise, repeatable wire processing.
                </p>
              </div>
              <span className="flex h-10 w-10 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-full bg-white text-[#0a1628] transition-transform group-hover:translate-x-1 flex-shrink-0">
                <ArrowRight size={16} className="sm:w-[18px]" />
              </span>
            </div>
          </Link>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
            {supportingProducts.map((product, index) => (
              <Link
                key={product.href}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[180px] sm:min-h-[220px] md:min-h-0 flex-col overflow-hidden rounded-[16px] sm:rounded-[24px] border border-[#e5eaf0] bg-[#f8fafc] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#bfdbfe] hover:bg-white hover:shadow-[0_18px_45px_-20px_rgba(15,23,42,0.28)]"
              >
                <div className="relative min-h-[100px] sm:min-h-0 flex-1">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
                <div className="mt-3 sm:mt-4 flex items-end justify-between gap-2 sm:gap-4 border-t border-[#e5eaf0] pt-3 sm:pt-4">
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 sm:mb-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">
                      {index < 2 ? "Equipment" : "Component"}
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold leading-4 sm:leading-5 text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
                      {product.name}
                    </h3>
                  </div>
                  <ArrowRight
                    size={14}
                    className="sm:w-4 mb-0.5 flex-none text-[#94a3b8] transition-all group-hover:translate-x-0.5 group-hover:text-[#2563eb] flex-shrink-0"
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
