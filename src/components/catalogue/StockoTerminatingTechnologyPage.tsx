import { ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { CatalogueCategory } from "@/lib/magentoCatalogue";
import {
  STOCKO_TERM_PARTNER_URL,
  stockoMachineGroups,
  stockoMachinesCount,
  type StockoMachineGroup,
} from "@/data/stockoTerminatingTechnology";
import StockoMachineBrowser from "./StockoMachineBrowser";

type Props = {
  category: CatalogueCategory;
  machineGroup?: StockoMachineGroup;
};

export default function StockoTerminatingTechnologyPage({ category: _, machineGroup }: Props) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-6">
          <Breadcrumbs
            light
            crumbs={[
              { label: "Webshop", href: "/webshop.html" },
              { label: "Components", href: "/webshop/components.html" },
              { label: "Sealed Connectors", href: "/webshop/components/sealed-connectors.html" },
              { label: "Stocko", href: "/webshop/components/sealed-connectors/stocko.html" },
              ...(machineGroup
                ? [
                    {
                      label: "Terminating Technology",
                      href: "/webshop/components/sealed-connectors/stocko/terminating-technology.html",
                    },
                    { label: machineGroup.name },
                  ]
                : [{ label: "Terminating Technology" }]),
            ]}
          />
          <div className="mt-5">
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
              Stocko Terminating Technology
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#94a3b8]">
              {stockoMachinesCount} STOCKOMAT automated crimping machines — from the economy WT 255 to
              the professional Panel Mount and Daisy Chain xtra lines. Contact us to discuss machine
              selection for your production setup.
            </p>
            <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3">
              <span className="text-sm text-[#94a3b8]">
                Full technical specifications at Stocko Contact.
              </span>
              <a
                href={STOCKO_TERM_PARTNER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#fbbf24] transition-colors hover:text-[#f59e0b]"
              >
                Go to manufacturer site
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <StockoMachineBrowser
        groups={stockoMachineGroups}
        initialGroup={machineGroup?.fullName}
      />
    </div>
  );
}
