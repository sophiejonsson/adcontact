"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Menu, X, ChevronDown, FileText, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { megaMenuSections, topNavItems } from "@/data/navigation";
import MegaMenu from "./MegaMenu";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu(id: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(id);
  }

  function scheduleClose() {
    // Always clear any pending timer first so only ONE close timer is ever
    // live — otherwise overlapping mouseleave events orphan timers that
    // cancelClose can't reach, and the menu closes while it's being hovered.
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 220);
  }

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function closeAll() {
    setActiveMenu(null);
    setMobileOpen(false);
  }

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden border-b border-[#0f2042] bg-[#0a1628] lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-1.5">
          <div className="flex items-center gap-5 text-xs text-[#64748b]">
            <span>ISO 9001:2015 Certified</span>
            <span className="text-[#1e3a6e]">·</span>
            <span>Specialist distributor since 1985</span>
            <span className="text-[#1e3a6e]">·</span>
            <span>Global Coverage</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#64748b]">
            <a
              href="tel:+46084453600"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone size={11} />
              +46 (0)8-445 36 00
            </a>
            <span className="text-[#1e3a6e]">·</span>
            <a
              href="mailto:info@adcontact.se"
              className="transition-colors hover:text-white"
            >
              info@adcontact.se
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className="sticky top-0 z-50 border-b border-[#e8ecf2] bg-white shadow-[0_1px_0_0_#e8ecf2]"
        onMouseLeave={scheduleClose}
      >
        <div className="mx-auto max-w-[1440px] px-6">
          {/* Single line: logo · menu · search · Request Quote */}
          <div className="flex h-16 items-center gap-4 lg:gap-6">
            {/* Logo */}
            <Link href="/" onClick={closeAll} className="flex-shrink-0">
              <Image
                src="/images/logotopmenu.png"
                alt="Adcontact"
                width={148}
                height={48}
                className="h-[44px] w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Menu */}
            <nav className="hidden h-full items-center lg:flex">
              {megaMenuSections.map((section) => (
                <div
                  key={section.id}
                  className="relative flex h-full items-center"
                  onMouseEnter={() => openMenu(section.id)}
                >
                  <Link
                    href={section.href}
                    onClick={() => setActiveMenu(null)}
                    className={cn(
                      "flex h-full items-center gap-1 px-3 text-sm font-medium whitespace-nowrap transition-colors first:pl-0",
                      activeMenu === section.id
                        ? "text-[#2563eb]"
                        : "text-[#374151] hover:text-[#0a1628]"
                    )}
                  >
                    {section.label}
                    <ChevronDown
                      size={13}
                      className={cn(
                        "transition-transform duration-200 text-[#9ca3af]",
                        activeMenu === section.id ? "rotate-180 text-[#2563eb]" : ""
                      )}
                    />
                  </Link>
                  {activeMenu === section.id && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2563eb]" />
                  )}
                </div>
              ))}

              {/* Divider between catalogue and corporate links */}
              <span className="mx-2 h-5 w-px bg-[#e2e8f0]" aria-hidden="true" />

              {topNavItems.map((item) =>
                item.children ? (
                  <div key={item.href} className="relative flex h-full items-center group">
                    <button
                      className="flex h-full items-center gap-1 px-3 text-sm font-medium whitespace-nowrap text-[#475569] transition-colors hover:text-[#0a1628]"
                    >
                      {item.label}
                      <ChevronDown size={12} className="text-[#9ca3af] transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    <div className="absolute right-0 top-full z-50 hidden group-hover:block pt-1">
                      <div className="min-w-[220px] rounded-xl border border-[#e8ecf2] bg-white shadow-lg py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeAll}
                            className="block px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f3f4f6] hover:text-[#0a1628] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveMenu(null)}
                    className="flex h-full items-center px-3 text-sm font-medium whitespace-nowrap text-[#475569] transition-colors hover:text-[#0a1628]"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Search — fills the remaining space */}
            <SearchAutocomplete
              className="hidden flex-1 min-w-0 md:block"
              onNavigate={closeAll}
              prominent
            />

            {/* Request Quote — pinned to the right edge */}
            <div className="ml-auto flex flex-shrink-0 items-center gap-2 lg:ml-0">
              <Link
                href="/contact/quote"
                onClick={closeAll}
                className="btn-elevate btn-elevate-amber hidden items-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 text-sm font-bold text-[#0a1628] shadow-sm transition-colors hover:bg-[#d97706] sm:flex"
              >
                <FileText size={15} />
                Request a quote
              </Link>
              <button
                className="rounded-md p-2 text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#0a1628] lg:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega menu — rendered directly so its absolute panel is a real hit-target.
            onMouseEnter cancels the pending close; onMouseLeave re-arms it. */}
        {activeMenu && (
          <MegaMenu
            section={megaMenuSections.find((s) => s.id === activeMenu)!}
            onClose={() => setActiveMenu(null)}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="max-h-[80vh] overflow-y-auto border-t border-[#e8ecf2] bg-white lg:hidden">
            {/* Mobile search */}
            <div className="border-b border-[#f1f5f9] px-4 py-3">
              <SearchAutocomplete onNavigate={() => setMobileOpen(false)} />
            </div>

            <div className="px-3 py-3 space-y-0.5">
              {megaMenuSections.map((section) => (
                <div key={section.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded((e) =>
                        e === section.id ? null : section.id
                      )
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#0a1628]"
                  >
                    {section.label}
                    <ChevronDown
                      size={15}
                      className={cn(
                        "text-[#9ca3af] transition-transform duration-200",
                        mobileExpanded === section.id ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {mobileExpanded === section.id && (
                    <div className="mb-1 ml-3 space-y-0.5 border-l border-[#e8ecf2] pl-3">
                      <Link
                        href={section.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide text-[#2563eb] hover:bg-[#eff6ff]"
                      >
                        View all →
                      </Link>
                      {section.groups.flatMap((g) =>
                        g.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-2 py-2 text-sm text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#0a1628]"
                          >
                            {item.label}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}

              {topNavItems.map((item) =>
                item.children ? (
                  <div key={item.href}>
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                      {item.label}
                    </p>
                    <div className="ml-3 border-l border-[#e8ecf2] pl-3 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-md px-2 py-2 text-sm text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#0a1628]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#0a1628]"
                  >
                    {item.label}
                  </Link>
                )
              )}

              <div className="border-t border-[#e8ecf2] pt-3 mt-3">
                <Link
                  href="/contact/quote"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-4 py-3 text-sm font-semibold text-[#0a1628]"
                >
                  Request a quote
                </Link>
                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[#64748b]">
                  <a href="tel:+46084453600" className="flex items-center gap-1.5">
                    <Phone size={11} />
                    +46 (0)8-445 36 00
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
