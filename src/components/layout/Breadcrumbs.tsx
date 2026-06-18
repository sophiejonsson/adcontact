import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({
  crumbs,
  light = false,
}: {
  crumbs: Crumb[];
  light?: boolean;
}) {
  const base = light ? "text-[#64748b]" : "text-[#6b7280]";
  const hover = light ? "hover:text-white" : "hover:text-[#2563eb]";
  const active = light ? "text-[#cbd5e1] font-medium" : "text-[#374151] font-medium";
  const sep = light ? "text-[#334155]" : "text-[#d1d5db]";

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-xs ${base}`}>
      <Link href="/" className={`flex items-center ${hover} transition-colors`}>
        <Home size={12} />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} className={sep} />
          {crumb.href ? (
            <Link href={crumb.href} className={`${hover} transition-colors`}>
              {crumb.label}
            </Link>
          ) : (
            <span className={active}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
