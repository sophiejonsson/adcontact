import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import RFQForm from "@/components/ui/RFQForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact & Quote Request",
  description:
    "Request a quote for industrial components or wire-processing equipment. Contact Adcontact's technical sales team in Sweden, Finland, Norway, Denmark, or Estonia.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; product?: string; tab?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <Breadcrumbs crumbs={[{ label: "Contact" }]} />
          <h1 className="text-3xl font-bold text-[#0a1628] mt-4 mb-2">
            Contact & quote request
          </h1>
          <p className="text-[#6b7280] text-sm max-w-xl">
            Need help finding the right component or planning a production equipment setup? Our technical sales team covers the full Nordic region.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#f3f4f6]">
                <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center">
                  <MessageSquare size={18} className="text-[#2563eb]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#0a1628]">Send a request</h2>
                  <p className="text-xs text-[#6b7280]">
                    Standard RFQs answered within 1 business day
                  </p>
                </div>
              </div>
              <RFQForm subject={params.subject} />
            </div>
          </div>

          {/* Sidebar contact info */}
          <div className="lg:col-span-1 space-y-4">
            {/* HQ */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-[#0a1628] mb-4">Sweden (Head Office)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-[#2563eb] mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-[#374151] leading-relaxed">
                    Adcontact AB<br />
                    Ekbacksvägen 22<br />
                    SE-168 69 Bromma<br />
                    Sweden
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-[#2563eb] flex-shrink-0" />
                  <a href="tel:+46084453600" className="text-xs text-[#374151] hover:text-[#2563eb] transition-colors">
                    +46 (0)8-445 36 00
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-[#2563eb] flex-shrink-0" />
                  <a href="mailto:info@adcontact.se" className="text-xs text-[#374151] hover:text-[#2563eb] transition-colors">
                    info@adcontact.se
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-[#2563eb]" />
                <h3 className="text-sm font-semibold text-[#0a1628]">Business hours</h3>
              </div>
              <div className="space-y-1.5 text-xs text-[#374151]">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Monday – Friday</span>
                  <span className="font-medium">08:00 – 17:00 CET</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Saturday – Sunday</span>
                  <span className="font-medium text-[#9ca3af]">Closed</span>
                </div>
              </div>
              <p className="text-[10px] text-[#9ca3af] mt-3">
                RFQs submitted outside business hours are processed the following business day.
              </p>
            </div>

            {/* Coverage */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#0a1628] mb-3">Nordic coverage</h3>
              {["Sweden", "Finland", "Norway", "Denmark", "Estonia"].map((country) => (
                <div key={country} className="flex items-center gap-2 py-1.5 border-b border-[#f3f4f6] last:border-0">
                  <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full" />
                  <span className="text-xs text-[#374151]">{country}</span>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="bg-[#0a1628] border border-[#1e3a6e] rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-white mb-1">1 day</div>
              <div className="text-xs text-[#94a3b8]">standard RFQ response time</div>
              <div className="text-[10px] text-[#475569] mt-2">
                Complex or custom enquiries may take 2–3 business days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
