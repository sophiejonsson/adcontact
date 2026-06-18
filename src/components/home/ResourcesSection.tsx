import Link from "next/link";
import { ArrowRight, Download, BookOpen, ClipboardList, Award, FileText } from "lucide-react";
import { resources } from "@/data/resources";

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
  guide: "bg-blue-50 text-blue-700",
  checklist: "bg-green-50 text-green-700",
  certificate: "bg-amber-50 text-amber-700",
  article: "bg-slate-50 text-slate-700",
  datasheet: "bg-purple-50 text-purple-700",
};

export default function ResourcesSection() {
  const featured = resources.filter((r) => r.featured);

  return (
    <section className="py-24 bg-[#f8fafc] border-t border-[#e2e8f0]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-[0.14em] mb-3">
              Technical resources
            </p>
            <h2 className="text-[32px] lg:text-4xl font-extrabold text-[#0a1628] leading-[1.08]">
              Knowledge for technical buyers
            </h2>
            <p className="text-sm text-[#6b7280] mt-2 max-w-lg">
              Selection guides, checklists, and technical articles to help engineers and procurement teams choose and specify the right components.
            </p>
          </div>
          <Link
            href="/resources"
            className="flex items-center gap-1.5 text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex-shrink-0"
          >
            All resources
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((resource) => {
            const Icon = typeIcon[resource.type] || FileText;
            return (
              <Link
                key={resource.id}
                href={`/resources/${resource.slug}`}
                className="surface-card group flex flex-col rounded-2xl p-5"
              >
                {/* Type badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold rounded-md ${typeColor[resource.type]}`}
                  >
                    <Icon size={10} />
                    {typeLabel[resource.type]}
                  </span>
                  {resource.downloadable && (
                    <Download size={13} className="text-[#9ca3af] group-hover:text-[#2563eb] transition-colors" />
                  )}
                </div>

                <h3 className="text-sm font-semibold text-[#0a1628] mb-2 group-hover:text-[#2563eb] transition-colors leading-snug">
                  {resource.title}
                </h3>
                <p className="text-xs text-[#6b7280] leading-relaxed flex-1 mb-4">
                  {resource.description.slice(0, 120)}…
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-[#f3f4f6] text-[9px] text-[#6b7280] rounded capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
