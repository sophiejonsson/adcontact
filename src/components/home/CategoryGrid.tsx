import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Cable,
  CircuitBoard,
  Cpu,
  Factory,
  Flame,
  Wrench,
  Zap,
} from "lucide-react";
import { categories } from "@/data/categories";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap,
  Flame,
  CircuitBoard,
  Cable,
  Cpu,
  Wrench,
  Factory,
};

export default function CategoryGrid() {
  return (
    <section className="bg-[#f8fafc] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="mb-7 sm:mb-8 md:mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
              Webshop
            </p>
            <h2 className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-4xl font-extrabold leading-[1.1] sm:leading-[1.08] text-[#0a1628]">
              Explore product areas
            </h2>
            <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm leading-5 sm:leading-6 text-[#64748b]">
              Browse components and production equipment by application area.
            </p>
          </div>
          <Link
            href="/webshop.html"
            className="flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-semibold text-[#2563eb] transition-colors hover:text-[#1d4ed8] min-h-[44px] sm:min-h-auto mt-3 lg:mt-0 px-4 sm:px-0"
          >
            Browse the full webshop
            <ArrowRight size={13} className="sm:w-[14px]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Zap;
            const isLastOdd = categories.length % 2 === 1 && index === categories.length - 1;

            return (
              <Link
                key={category.id}
                href={category.webshopHref}
                className={`group grid min-h-60 sm:min-h-64 overflow-hidden rounded-[16px] sm:rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)] sm:grid-cols-[1.1fr_0.9fr] ${
                  isLastOdd ? "lg:col-span-2 lg:grid-cols-[1fr_0.7fr]" : ""
                }`}
              >
                <div className="flex min-w-0 flex-col p-4 sm:p-6 md:p-7">
                  <div className="mb-4 sm:mb-5 flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-[#eff6ff] text-[#2563eb] transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                    <Icon size={16} className="sm:w-[18px]" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold leading-snug text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-[#64748b]">
                    {category.shortDescription}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1">
                      {category.exampleBrands.slice(0, 3).map((brand) => (
                        <span
                          key={brand}
                          className="text-[10px] sm:text-[11px] font-medium text-[#64748b]"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                    <span className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] text-[#64748b] transition-all group-hover:border-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white">
                      <ArrowRight size={14} className="sm:w-[15px]" />
                    </span>
                  </div>
                </div>

                <div className="relative min-h-40 sm:min-h-52 overflow-hidden border-t border-[#f1f5f9] bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] sm:min-h-full sm:border-l sm:border-t-0">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      className="object-contain p-4 sm:p-6 md:p-7 transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes={isLastOdd ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 1024px) 100vw, 28vw"}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Icon size={40} className="sm:w-12 text-[#cbd5e1]" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/15 to-transparent" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
