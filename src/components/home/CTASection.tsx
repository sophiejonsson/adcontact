import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

const offices = [
  {
    label: "Estonia — Headquarters",
    company: "Gammeter OÜ",
    phone: "+372 671 22 51",
    phoneHref: "tel:+3726712251",
    email: "info@gammeter.ee",
  },
  {
    label: "Sweden — Sales Office",
    company: "Adcontact AB",
    phone: "+46 (0)8-445 36 00",
    phoneHref: "tel:+46084453600",
    email: "info@adcontact.se",
  },
];

export default function CTASection() {
  return (
    <section className="bg-canvas py-8 sm:py-10 md:py-12 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2f5a] rounded-[16px] sm:rounded-2xl p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 relative overflow-hidden ring-1 ring-white/5 shadow-[0_30px_80px_-20px_rgba(10,22,40,0.5)]">
          {/* Background grid */}
          <div className="absolute inset-0 tech-grid opacity-30 rounded-[16px] sm:rounded-2xl" />
          <div className="absolute bottom-0 right-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-[#2563eb] opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Bring us the part number or the production challenge.
            </h2>
            <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed max-w-xl mb-5 sm:mb-6">
              We will help verify the specification, identify compatible parts, or define the
              equipment needed for your process.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {offices.map((office) => (
                <div
                  key={office.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="mb-3 flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#2563eb] flex-shrink-0" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#60a5fa]">
                      {office.label}
                    </span>
                  </div>
                  <p className="mb-2.5 text-xs font-semibold text-white">{office.company}</p>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      <Phone size={11} className="text-[#2563eb] flex-shrink-0" />
                      <a href={office.phoneHref} className="hover:text-white transition-colors">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      <Mail size={11} className="text-[#2563eb] flex-shrink-0" />
                      <a href={`mailto:${office.email}`} className="hover:text-white transition-colors">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col gap-2 sm:gap-3 flex-shrink-0 w-full lg:w-auto">
            <Link
              href="/contact"
              className="btn-elevate btn-elevate-amber flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1628] text-xs sm:text-sm font-bold rounded-lg w-full lg:w-auto min-w-[160px] sm:min-w-[220px] min-h-[44px] sm:min-h-auto"
            >
              Request a quote
              <ArrowRight size={14} className="sm:w-[15px]" />
            </Link>
            <Link
              href="/contact?tab=specialist"
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium rounded-lg border border-white/20 hover:border-white/30 transition-colors w-full lg:w-auto min-h-[44px] sm:min-h-auto"
            >
              Discuss an application
            </Link>
            <p className="text-center text-[9px] sm:text-[10px] text-[#475569]">
              Standard RFQs answered within 1 business day
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
