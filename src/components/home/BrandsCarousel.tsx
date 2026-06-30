import Image from "next/image";
import { brands } from "@/data/brands";

const logoBrands = brands.filter((brand) => brand.logo && brand.website);

const marqueeCss = `
@keyframes adc-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.adc-marquee-track {
  animation: adc-marquee 80s linear infinite;
  will-change: transform;
}
.adc-marquee-viewport:hover .adc-marquee-track {
  animation-play-state: paused;
}
.adc-marquee-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .adc-marquee-track { animation: none; }
}
`;

export default function BrandsCarousel() {
  // Duplicate the set so the track can loop seamlessly (translateX -50%).
  const track = [...logoBrands, ...logoBrands];

  return (
    <section className="border-b border-white/10 bg-[#0a1628] py-4 sm:py-5 md:py-6">
      <style dangerouslySetInnerHTML={{ __html: marqueeCss }} />

      <div className="mx-auto mb-3 sm:mb-4 max-w-[1440px] px-4 sm:px-6">
        <p className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#475569]">
          Trusted manufacturer partners
        </p>
      </div>

      <div className="adc-marquee-viewport adc-marquee-mask relative overflow-hidden">
        <div className="adc-marquee-track flex w-max items-center gap-6 sm:gap-10 md:gap-12 lg:gap-16">
          {track.map((brand, i) => (
            <a
              key={`${brand.id}-${i}`}
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${brand.name} website`}
              aria-hidden={i >= logoBrands.length}
              tabIndex={i >= logoBrands.length ? -1 : undefined}
              className="group flex flex-none items-center justify-center rounded-md bg-gray-50 px-3 py-1.5 transition duration-200"
              style={{ width: brand.logoWidth ? `${Math.round(brand.logoWidth * 0.85) + 24}px` : "128px" }}
            >
              <div className="relative h-6 sm:h-7 md:h-8 w-full">
                <Image
                  src={brand.logo!}
                  alt={brand.name}
                  fill
                  sizes="160px"
                  className="object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  unoptimized
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
