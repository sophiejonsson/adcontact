import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ClipboardList, Award, FileText, Download, ArrowRight } from "lucide-react";
import { resources } from "@/data/resources";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Technical Resources | Guides & Documentation",
  description:
    "Heat shrink selection guide, connector selection guide, crimping quality basics, wire harness checklists, RFQ checklist, and ISO 9001:2015 quality documentation.",
};

const typeIcon: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  guide: BookOpen,
  checklist: ClipboardList,
  certificate: Award,
  article: FileText,
  datasheet: FileText,
};

const typeLabel: Record<string, string> = {
  guide: "Guide",
  checklist: "Checklist",
  certificate: "Certificate",
  article: "Article",
  datasheet: "Datasheet",
};

const typeColor: Record<string, string> = {
  guide: "bg-blue-50 text-blue-700 border-blue-100",
  checklist: "bg-green-50 text-green-700 border-green-100",
  certificate: "bg-amber-50 text-amber-700 border-amber-100",
  article: "bg-slate-50 text-slate-700 border-slate-100",
  datasheet: "bg-purple-50 text-purple-700 border-purple-100",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <Breadcrumbs crumbs={[{ label: "Resources" }]} />
          <h1 className="text-3xl font-bold text-[#0a1628] mt-4 mb-2">
            Technical resources
          </h1>
          <p className="text-[#6b7280] text-sm max-w-2xl">
            Selection guides, checklists, and technical articles to help engineers and procurement teams choose, specify, and source the right industrial components.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource) => {
            const Icon = typeIcon[resource.type] || FileText;
            return (
              <Link
                key={resource.id}
                href={`/resources/${resource.slug}`}
                className="group flex flex-col bg-white border border-[#e2e8f0] hover:border-[#2563eb] hover:shadow-[0_4px_24px_rgba(37,99,235,0.1)] rounded-xl p-6 transition-all duration-200"
              >
                {/* Type */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${typeColor[resource.type]}`}
                  >
                    <Icon size={11} />
                    {typeLabel[resource.type]}
                  </span>
                  {resource.downloadable && (
                    <span className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                      <Download size={11} />
                      PDF
                    </span>
                  )}
                </div>

                <h2 className="text-base font-semibold text-[#0a1628] mb-2 group-hover:text-[#2563eb] transition-colors leading-snug">
                  {resource.title}
                </h2>
                <p className="text-sm text-[#6b7280] leading-relaxed flex-1 mb-4">
                  {resource.description}
                </p>

                {/* Category + tags */}
                <div className="border-t border-[#f3f4f6] pt-4">
                  <span className="text-[10px] font-medium text-[#9ca3af] uppercase tracking-wider">
                    {resource.category}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-[#f3f4f6] text-[9px] text-[#6b7280] rounded capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-3 text-sm font-medium text-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity">
                  {resource.downloadable ? "Download" : "Read more"}
                  <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Custom request */}
        <div className="mt-12 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8 text-center">
          <h3 className="text-base font-semibold text-[#0a1628] mb-2">
            Need a specific datasheet or technical document?
          </h3>
          <p className="text-sm text-[#6b7280] max-w-md mx-auto mb-5">
            We can provide datasheets, application notes, CAD data, 3D models, and compliance documents for all products we supply. Contact us with the part number or brand.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors"
          >
            Request documentation
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
