import Image from "next/image";
import { brands } from "@/data/brands";

const logoBrands = brands.filter((brand) => brand.logo && brand.website);

const marqueeCss = `
@keyframes adc-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.adc-marquee-track {
  animation: adc-marquee 40s linear infinite;
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
    <section className="border-b border-[#eef2f7] bg-white py-6">
      <style dangerouslySetInnerHTML={{ __html: marqueeCss }} />

      <div className="mx-auto mb-4 max-w-[1440px] px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
          Trusted manufacturer partners
        </p>
      </div>

      <div className="adc-marquee-viewport adc-marquee-mask relative overflow-hidden">
        <div className="adc-marquee-track flex w-max items-center gap-12 sm:gap-16">
          {track.map((brand, i) => (
            <a
              key={`${brand.id}-${i}`}
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${brand.name} website`}
              aria-hidden={i >= logoBrands.length}
              tabIndex={i >= logoBrands.length ? -1 : undefined}
              className="relative h-9 flex-none"
              style={{ width: brand.logoWidth ? `${brand.logoWidth}px` : "130px" }}
            >
              <Image
                src={brand.logo!}
                alt={brand.name}
                fill
                sizes="170px"
                className="object-contain opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
                unoptimized
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
