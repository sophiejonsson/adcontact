import { type ReactNode } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

type Crumb = { label: string; href?: string };

/**
 * Shared dark page header for top-level menu pages (About, Contact, Quality,
 * Trusted Partners, Policies…). Same background, padding, breadcrumb and title
 * treatment on every page so the header keeps a consistent size and the text
 * stays put when navigating between them. An optional `aside` shows content on
 * the right (e.g. the About page's company-history card).
 */
export default function PageHeader({
  crumbs,
  title,
  intro,
  aside,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="bg-[#0a1628]">
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <Breadcrumbs crumbs={crumbs} light />
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-[-0.035em] text-white">{title}</h1>
            {intro ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">{intro}</p>
            ) : null}
          </div>
          {aside ? <div className="w-full lg:w-auto lg:flex-shrink-0">{aside}</div> : null}
        </div>
      </div>
    </div>
  );
}
