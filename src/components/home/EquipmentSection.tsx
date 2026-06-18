import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scissors, Zap, Wrench, Waves, ScanLine, CheckSquare } from "lucide-react";
import { equipmentCategories } from "@/data/equipment";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Scissors,
  Zap,
  Wrench,
  Waves,
  ScanLine,
  CheckSquare,
};

export default function EquipmentSection() {
  return (
    <section className="py-24 bg-[#0a1628] relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563eb] opacity-[0.04] rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.14em] mb-3">
              Production equipment
            </p>
            <h2 className="text-[32px] lg:text-4xl font-extrabold text-white leading-[1.08]">
              From components to complete<br />
              wire-processing solutions
            </h2>
            <p className="text-[#64748b] text-sm mt-3 max-w-lg leading-relaxed">
              Beyond component supply, Adcontact designs and sources complete wire-processing lines, from wire cutting to final electrical test. One partner for the complete production setup.
            </p>
          </div>
          <Link
            href="/production-equipment"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 border border-[#1e3a6e] hover:border-[#2563eb] text-[#93c5fd] hover:text-white text-sm font-medium rounded-md transition-all"
          >
            View all equipment
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Equipment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {equipmentCategories.map((eq) => {
            const Icon = iconMap[eq.icon] || Wrench;
            return (
              <Link
                key={eq.id}
                href={`/production-equipment/${eq.slug}`}
                className="surface-card-dark group bg-[#0f2042] hover:bg-[#13294f] rounded-2xl overflow-hidden"
              >
                {/* Equipment photo */}
                {"image" in eq && eq.image ? (
                  <div className="p-4 pb-0">
                    <div className="relative h-40 rounded-xl bg-white overflow-hidden ring-1 ring-white/10">
                      <Image
                        src={eq.image}
                        alt={eq.name}
                        fill
                        className="object-contain p-4 group-hover:scale-[1.04] transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-[#1a2f5a] group-hover:bg-[#2563eb] rounded-lg flex items-center justify-center transition-colors duration-200">
                      <Icon
                        size={18}
                        className="text-[#60a5fa] group-hover:text-white transition-colors duration-200"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {eq.brands.slice(0, 2).map((b) => (
                        <span key={b} className="text-[10px] text-[#475569] font-medium px-1.5 py-0.5 bg-[#1a2f5a] rounded border border-[#1e3a6e]">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-[#93c5fd] transition-colors">
                    {eq.name}
                  </h3>
                  <p className="text-xs text-[#64748b] leading-relaxed mb-4">
                    {eq.description}
                  </p>

                  <div className="space-y-1.5">
                    {eq.keyFeatures.slice(0, 3).map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-[10px] text-[#475569]">
                        <span className="w-1 h-1 bg-[#2563eb] rounded-full flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 mt-4 text-xs font-medium text-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA bar */}
        <div className="bg-gradient-to-r from-[#0f2042] to-[#1a2f5a] border border-[#1e3a6e] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold text-base mb-1">
              Discuss your production setup
            </h3>
            <p className="text-[#64748b] text-xs">
              We design custom wire-processing line configurations matched to your production volume, wire range, and quality requirements.
            </p>
          </div>
          <Link
            href="/contact?subject=production-equipment"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors"
          >
            Talk to a specialist
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
