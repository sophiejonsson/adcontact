import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-canvas py-10 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2f5a] rounded-2xl p-7 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden ring-1 ring-white/5 shadow-[0_30px_80px_-20px_rgba(10,22,40,0.5)]">
          {/* Background grid */}
          <div className="absolute inset-0 tech-grid opacity-30 rounded-2xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#2563eb] opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
              Bring us the part number<br />
              or the production challenge.
            </h2>
            <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xl mb-6">
              We will help verify the specification, identify compatible parts, or define the
              equipment needed for your process.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <Phone size={14} className="text-[#2563eb]" />
                <a href="tel:+46084453600" className="hover:text-white transition-colors">
                  +46 (0)8-445 36 00
                </a>
              </div>
              <div className="hidden sm:block text-[#374151]">·</div>
              <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <Mail size={14} className="text-[#2563eb]" />
                <a href="mailto:info@adcontact.se" className="hover:text-white transition-colors">
                  info@adcontact.se
                </a>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-3 flex-shrink-0 w-full lg:w-auto">
            <Link
              href="/contact"
              className="btn-elevate btn-elevate-amber flex items-center justify-center gap-2 px-6 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1628] text-sm font-bold rounded-lg w-full lg:w-auto min-w-[220px]"
            >
              Request a quote
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact?tab=specialist"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg border border-white/20 hover:border-white/30 transition-colors w-full lg:w-auto"
            >
              Discuss an application
            </Link>
            <p className="text-center text-[10px] text-[#475569]">
              Standard RFQs answered within 1 business day
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
