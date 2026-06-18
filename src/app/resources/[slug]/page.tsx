import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, ArrowLeft, ArrowRight, BookOpen, ClipboardList, Award, FileText } from "lucide-react";
import { resources } from "@/data/resources";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

type Props = {
  params: Promise<{ slug: string }>;
};

const typeIcon: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  guide: BookOpen,
  checklist: ClipboardList,
  certificate: Award,
  article: FileText,
  datasheet: FileText,
};

export async function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.description.slice(0, 160),
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) notFound();

  const Icon = typeIcon[resource.type] || FileText;
  const related = resources.filter((r) => r.id !== resource.id && r.category === resource.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <Breadcrumbs
            crumbs={[
              { label: "Resources", href: "/resources" },
              { label: resource.title },
            ]}
          />
          <div className="flex items-start justify-between gap-4 mt-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-[#2563eb]" />
                <span className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider">
                  {resource.type} · {resource.category}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#0a1628] mb-2">
                {resource.title}
              </h1>
            </div>
            {resource.downloadable && (
              <Link
                href={`/contact?subject=${encodeURIComponent(`Request PDF: ${resource.title}`)}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors"
              >
                <Download size={14} />
                Request PDF
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {/* Content placeholder */}
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-[#374151] leading-relaxed text-lg">{resource.description}</p>

              <div className="mt-8 p-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                <p className="text-sm font-medium text-[#374151] mb-2">
                  Full document available on request
                </p>
                <p className="text-xs text-[#6b7280] leading-relaxed mb-4">
                  Contact our technical team to receive the full guide, checklist, or documentation. We can provide application-specific versions and formats suited to your procurement or engineering requirements.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-md transition-colors"
                >
                  Request full document
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-[#f3f4f6] text-xs text-[#374151] rounded capitalize">
                  {tag}
                </span>
              ))}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[#e2e8f0]">
                <h3 className="text-sm font-semibold text-[#374151] mb-4">Related resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/resources/${r.slug}`}
                      className="group p-4 bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#2563eb] rounded-xl transition-colors"
                    >
                      <p className="text-xs font-medium text-[#6b7280] mb-1 uppercase tracking-wider">{r.type}</p>
                      <h4 className="text-sm font-semibold text-[#0a1628] group-hover:text-[#2563eb] transition-colors">
                        {r.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-[#0a1628] mb-2">Need application support?</h3>
              <p className="text-xs text-[#6b7280] mb-5 leading-relaxed">
                Our technical team can advise on component selection, application fit, and compliance for your specific production or design requirements.
              </p>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg transition-colors mb-3"
              >
                Talk to a specialist
              </Link>
              <Link
                href="/resources"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] text-[#374151] text-sm font-medium rounded-lg transition-colors hover:bg-[#f3f4f6]"
              >
                <ArrowLeft size={13} />
                All resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
