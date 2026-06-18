"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MegaMenuSection, NavGroup, NavItem } from "@/data/navigation";

type Props = {
  section: MegaMenuSection;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/* ── Shared building blocks ─────────────────────────────────────────── */

// Full-width white panel; content is left-aligned to the nav's content rail.
function PanelShell({
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="animate-menu-reveal absolute left-0 right-0 border-t border-[#eef2f7] bg-white shadow-[0_20px_50px_-24px_rgba(10,22,40,0.3)]"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-6">{children}</div>
    </div>
  );
}

function GroupHeader({ group, onClose }: { group: NavGroup; onClose: () => void }) {
  if (!group.href) {
    return (
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9ca3af]">
        {group.label}
      </h3>
    );
  }
  return (
    <Link
      href={group.href}
      onClick={onClose}
      className="group mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2563eb]"
    >
      {group.label}
      <ArrowRight
        size={11}
        className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
      />
    </Link>
  );
}

// Sub-brands as a clean, scannable inline list.
function BrandList({ items, onClose }: { items?: NavItem[]; onClose: () => void }) {
  if (!items?.length) return null;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] leading-snug">
      {items.map((brand, index) => (
        <span key={brand.href} className="inline-flex items-center gap-x-2">
          {index > 0 && (
            <span className="text-[#d1d5db]" aria-hidden="true">
              ·
            </span>
          )}
          <Link
            href={brand.href}
            onClick={onClose}
            className="text-[#64748b] transition-colors hover:text-[#2563eb]"
          >
            {brand.label}
          </Link>
        </span>
      ))}
    </div>
  );
}

function CategoryBlock({ item, onClose }: { item: NavItem; onClose: () => void }) {
  return (
    <div>
      <Link
        href={item.href}
        onClick={onClose}
        className="text-[14px] font-semibold text-[#0a1628] transition-colors hover:text-[#2563eb]"
      >
        {item.label}
      </Link>
      <BrandList items={item.children} onClose={onClose} />
    </div>
  );
}

/* ── Panel variants ─────────────────────────────────────────────────── */

function CataloguePanel({ section, onClose, onMouseEnter, onMouseLeave }: Props) {
  const multiGroup = section.groups.length > 1;

  return (
    <PanelShell onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {multiGroup ? (
        <div className="flex flex-wrap gap-x-16 gap-y-6">
          {section.groups.map((group) => (
            <div key={group.label} className="min-w-[240px]">
              <GroupHeader group={group} onClose={onClose} />
              <div className="space-y-3.5">
                {group.items.map((item) => (
                  <CategoryBlock key={item.href} item={item} onClose={onClose} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <GroupHeader group={section.groups[0]} onClose={onClose} />
          <div className="grid max-w-4xl gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.groups[0]?.items.map((item) => (
              <CategoryBlock key={item.href} item={item} onClose={onClose} />
            ))}
          </div>
        </div>
      )}
    </PanelShell>
  );
}

function ResourcesPanel({ section, onClose, onMouseEnter, onMouseLeave }: Props) {
  return (
    <PanelShell onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="flex flex-wrap gap-x-16 gap-y-6">
        {section.groups.map((group) => (
          <div key={group.label} className="min-w-[260px]">
            <GroupHeader group={group} onClose={onClose} />
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group -mx-2 block rounded-md px-2 py-1.5 transition-colors hover:bg-[#f8fafc]"
                  >
                    <span className="block text-[14px] font-semibold text-[#0a1628] transition-colors group-hover:text-[#2563eb]">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 block text-[12px] leading-snug text-[#64748b]">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

export default function MegaMenu({
  section,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  if (section.variant === "catalogue-tree") {
    return (
      <CataloguePanel
        section={section}
        onClose={onClose}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  }
  return (
    <ResourcesPanel
      section={section}
      onClose={onClose}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
