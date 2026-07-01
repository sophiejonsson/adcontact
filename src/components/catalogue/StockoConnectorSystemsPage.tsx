import { ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { CatalogueCategory } from "@/lib/magentoCatalogue";
import {
  STOCKO_PARTNER_URL,
  stockoConnectorSystems,
  stockoSeriesCount,
  type StockoConnectorPitchGroup,
} from "@/data/stockoConnectorSystems";
import StockoSeriesBrowser from "./StockoSeriesBrowser";

type Props = {
  category: CatalogueCategory;
  pitchGroup?: StockoConnectorPitchGroup;
};

export default function StockoConnectorSystemsPage({ category: _, pitchGroup }: Props) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
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
              ...(pitchGroup
                ? [
                    {
                      label: "Connector Systems",
                      href: "/webshop/components/sealed-connectors/stocko/connector-systems.html",
                    },
                    { label: pitchGroup.pitch },
                  ]
                : [{ label: "Connector Systems" }]),
            ]}
          />
          <div className="mt-5">
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
              Stocko Connector Systems
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#94a3b8]">
              {stockoSeriesCount} connector series from S-LINX 1.27 mm signal connectors up to TL 3 power systems. Browse by pitch or search by name — then contact us and we&apos;ll help you source what you need.
            </p>
            <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3">
              <span className="text-sm text-[#94a3b8]">
                Full technical data at Stocko Contact — these series aren&apos;t yet stocked in our catalogue.
              </span>
              <a
                href={STOCKO_PARTNER_URL}
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

      {/* Interactive browser: search + pitch filter chips + card grid */}
      <StockoSeriesBrowser
        groups={stockoConnectorSystems}
        initialPitch={pitchGroup?.pitch}
      />
    </div>
  );
}
