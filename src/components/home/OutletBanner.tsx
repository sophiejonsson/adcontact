import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

/**
 * Launch-window banner for the new Outlet section — positioned right after
 * the hero search, before the brands carousel: visible, but secondary to the
 * main search/hero, which stays the primary path. Meant to be temporary —
 * once Outlet's own nav entry can carry ongoing awareness on its own, this
 * can come out or shrink. Only wire this into page.tsx once there's real
 * content behind /outlet worth sending traffic to.
 */
export default function OutletBanner() {
  return (
    <section className="border-b border-[#fde68a] bg-[#fffbeb]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309]">
            <Tag size={16} />
          </span>
          <p className="text-sm text-[#78350f]">
            <span className="font-bold">New: the Outlet.</span>{" "}
            Secondhand machines and surplus component stock, at outlet pricing while it lasts.
          </p>
        </div>
        <Link
          href="/outlet"
          className="inline-flex flex-none items-center gap-1.5 text-sm font-semibold text-[#b45309] hover:text-[#92400e]"
        >
          Browse the Outlet
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
