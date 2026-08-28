import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, Package, TriangleAlert } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { usedMachines, getUsedMachine } from "@/data/usedMachines";
import { absoluteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return usedMachines.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const machine = getUsedMachine(slug);
  if (!machine) return {};

  const title = `${machine.brand} ${machine.model} (used) | Outlet | Adcontact`;
  const description = `Secondhand ${machine.brand} ${machine.model}, S/N ${machine.serialNumber}. Full as-configured specification, condition and price on request.`;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/outlet/used-machines/${machine.slug}`) },
  };
}

export default async function UsedMachineDetailPage({ params }: Props) {
  const { slug } = await params;
  const machine = getUsedMachine(slug);
  if (!machine) notFound();

  const mainPhoto = machine.photos[0];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-[1440px] px-6 py-6">
        <Breadcrumbs
          crumbs={[
            { label: "Outlet", href: "/outlet" },
            { label: "Used Machines", href: "/outlet/used-machines" },
            { label: `${machine.brand} ${machine.model}` },
          ]}
        />
      </div>

      <main className="mx-auto max-w-[1440px] px-6 pb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          {/* Photo */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
              {mainPhoto ? (
                <Image src={mainPhoto} alt={`${machine.brand} ${machine.model}`} fill unoptimized className="object-contain p-6" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-[#94a3b8]">
                  <Package size={40} />
                  <span className="text-sm font-medium">No photo available yet</span>
                </div>
              )}
            </div>
            {mainPhoto && machine.photosAreReference && (
              <p className="mt-2 text-xs text-[#94a3b8]">
                Manufacturer reference photo — not the actual unit for sale. Photos of the physical
                machine and its exact condition available on request.
              </p>
            )}
          </div>

          {/* Key facts + CTA */}
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b45309]">
              Used machine
            </span>
            <h1 className="mt-3 text-2xl font-bold text-[#0a1628] sm:text-3xl">
              {machine.brand} {machine.model}
            </h1>
            <p className="mt-1 font-mono text-sm text-[#64748b]">S/N {machine.serialNumber}</p>

            <dl className="mt-6 space-y-3 rounded-xl border border-[#e2e8f0] bg-white p-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[#64748b]">Production year</dt>
                <dd className="font-semibold text-[#0a1628]">{machine.productionYear ?? "On request"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#64748b]">Production cycles</dt>
                <dd className="font-semibold text-[#0a1628]">{machine.productionCycles ?? "On request"}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-3">
                <dt className="text-[#64748b]">Price</dt>
                <dd className="text-lg font-bold text-[#0a1628]">{machine.price ?? "On request"}</dd>
              </div>
            </dl>

            <a
              href={`mailto:info@adcontact.se?subject=${encodeURIComponent(`Enquiry: ${machine.brand} ${machine.model} S/N ${machine.serialNumber}`)}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              <Mail size={15} />
              Enquire about this machine
            </a>

            {machine.referenceUrl && (
              <a
                href={machine.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#475569] hover:text-[#2563eb]"
              >
                Manufacturer&apos;s product page
                <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>

        {machine.conditionNotes && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-[#0a1628]">Condition</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#475569]">{machine.conditionNotes}</p>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-lg font-bold text-[#0a1628]">As configured</h2>
          <p className="mt-1 text-sm text-[#64748b]">
            The actual configuration of this specific unit, from the supplier&apos;s own equipment
            record — not a generic spec sheet.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f8fafc] text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  <th className="px-5 py-3">Part number</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {machine.configuration.map((item, index) => (
                  <tr key={`${item.partNumber}-${index}`} className={index % 2 ? "bg-[#f8fafc]" : "bg-white"}>
                    <td className="px-5 py-2.5 font-mono text-xs text-[#2563eb]">{item.partNumber}</td>
                    <td className="px-5 py-2.5 text-[#0a1628]">{item.description}</td>
                    <td className="px-5 py-2.5 text-right text-[#475569]">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {machine.excludedItems && machine.excludedItems.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2 text-[#b45309]">
              <TriangleAlert size={16} />
              <h2 className="text-sm font-bold uppercase tracking-wide">Not included</h2>
            </div>
            <p className="mt-1 text-sm text-[#64748b]">
              These items appear on the supplier&apos;s equipment record but are not part of this sale.
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-[#fde68a] bg-[#fffbeb]">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#fde68a]">
                  {machine.excludedItems.map((item, index) => (
                    <tr key={`${item.partNumber}-${index}`}>
                      <td className="px-5 py-2.5 font-mono text-xs text-[#b45309] line-through">{item.partNumber}</td>
                      <td className="px-5 py-2.5 text-[#92400e] line-through">{item.description}</td>
                      <td className="px-5 py-2.5 text-right text-[#92400e]">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
