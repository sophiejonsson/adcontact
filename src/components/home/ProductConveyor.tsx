import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/data/featuredProducts";

const marqueeCss = `
@keyframes adc-product-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.adc-product-track {
  animation: adc-product-marquee 60s linear infinite;
  will-change: transform;
}
.adc-product-viewport:hover .adc-product-track {
  animation-play-state: paused;
}
.adc-product-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .adc-product-track { animation: none; }
}
`;

const track = [...featuredProducts, ...featuredProducts];

export default function ProductConveyor() {
  return (
    <section className="border-b border-[#eef2f7] bg-[#f8fafc] py-5 sm:py-6">
      <style dangerouslySetInnerHTML={{ __html: marqueeCss }} />

      <div className="mx-auto mb-3 sm:mb-4 max-w-[1440px] px-4 sm:px-6">
        <p className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#94a3b8]">
          Featured products
        </p>
      </div>

      <div className="adc-product-viewport adc-product-mask relative overflow-hidden">
        <div className="adc-product-track flex w-max items-stretch gap-3 sm:gap-4 px-3 sm:px-4">
          {track.map((product, i) => (
            <Link
              key={`${product.href}-${i}`}
              href={product.href}
              aria-hidden={i >= featuredProducts.length}
              tabIndex={i >= featuredProducts.length ? -1 : undefined}
              className="group flex w-36 sm:w-40 flex-none flex-col overflow-hidden rounded-xl border border-[#e5eaf0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#bfdbfe] hover:shadow-md"
            >
              <div className="relative h-24 sm:h-28 w-full bg-[#f1f5f9]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.05]"
                  sizes="160px"
                  unoptimized
                />
              </div>
              <div className="px-2.5 py-2">
                <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-[#0a1628] group-hover:text-[#2563eb]">
                  {product.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
