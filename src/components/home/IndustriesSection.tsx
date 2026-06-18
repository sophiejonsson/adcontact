import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industries } from "@/data/industries";

const accentColors = [
  "from-blue-500/10 to-blue-600/5 border-blue-100",
  "from-indigo-500/10 to-indigo-600/5 border-indigo-100",
  "from-slate-500/10 to-slate-600/5 border-slate-100",
  "from-blue-600/10 to-blue-700/5 border-blue-100",
  "from-sky-500/10 to-sky-600/5 border-sky-100",
];

export default function IndustriesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left column */}
          <div className="lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
            <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-[0.14em] mb-3">
              Industries we serve
            </p>
            <h2 className="text-[32px] lg:text-4xl font-extrabold text-[#0a1628] leading-[1.08] mb-4">
              Built for industrial buyers and production teams
            </h2>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-6">
              Adcontact is used by procurement teams, engineers, and production managers across five industries where component reliability and technical fit are non-negotiable.
            </p>
            <Link
              href="/about#industries"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0a1628] hover:bg-[#1a2f5a] text-white text-sm font-medium rounded-md transition-colors"
            >
              About our industries
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {industries.map((industry, i) => (
              <Link
                key={industry.id}
                href={`/about#${industry.slug}`}
                className={`surface-card group p-6 rounded-2xl bg-gradient-to-br ${accentColors[i % accentColors.length]}`}
              >
                <h3 className="text-sm font-semibold text-[#0a1628] mb-2 group-hover:text-[#2563eb] transition-colors">
                  {industry.name}
                </h3>
                <p className="text-xs text-[#6b7280] leading-relaxed mb-4">
                  {industry.shortDescription}
                </p>
                <div className="space-y-1">
                  {industry.challenges.slice(0, 2).map((c) => (
                    <div key={c} className="flex items-start gap-1.5 text-[10px] text-[#374151]">
                      <span className="text-[#2563eb] mt-0.5 flex-shrink-0">→</span>
                      {c}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium text-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity">
                  View solutions <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
