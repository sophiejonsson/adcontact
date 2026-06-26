import Link from "next/link";
import { ChevronRight, ArrowRight, Phone, Mail } from "lucide-react";

/** Eyebrow + heading + description block used at the top of each section. */
export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563eb]">
        {eyebrow}
      </div>
      <h2 className="mb-3 text-3xl font-bold text-[#0a1628]">{title}</h2>
      {description && <p className="max-w-2xl text-[#64748b]">{description}</p>}
    </div>
  );
}

/** Sticky in-page navigation matching the Deutsch page. */
export function BrandJumpNav({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div className="sticky top-16 lg:top-[112px] z-30 border-b border-[#e5e7eb] bg-white shadow-sm">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="scrollbar-none flex gap-0 overflow-x-auto">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex-shrink-0 whitespace-nowrap border-b-2 border-transparent px-5 py-4 text-sm font-medium text-[#64748b] transition-all hover:border-[#2563eb] hover:text-[#0a1628]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export type Faq = { q: string; a: string };

/** FAQ accordion grid plus FAQPage JSON-LD for SEO. */
export function BrandFAQ({ faqs }: { faqs: Faq[] }) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="mb-20 scroll-mt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <SectionHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Common questions from engineers and buyers specifying these connectors."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-xl border border-[#e5e7eb] bg-white p-5 transition-shadow open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <h3 className="text-sm font-semibold leading-snug text-[#0a1628]">{faq.q}</h3>
              <ChevronRight
                size={16}
                className="mt-0.5 flex-shrink-0 text-[#94a3b8] transition-transform group-open:rotate-90"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Premium dark CTA matching the Deutsch page. */
export function BrandCTA({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#0a1628] p-8 text-white lg:p-12">
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="mb-3 text-2xl font-bold lg:text-3xl">{title}</h2>
          <p className="leading-relaxed text-[#94a3b8]">{body}</p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3">
          <Link
            href="/contact/quote"
            className="flex items-center gap-2 rounded-lg bg-[#f59e0b] px-7 py-3.5 font-semibold text-[#0a1628] transition-colors hover:bg-[#d97706]"
          >
            Request a quote
            <ArrowRight size={15} />
          </Link>
          <a
            href="tel:+46084453600"
            className="flex items-center gap-2 rounded-lg border border-[#1e3a6e] bg-[#1a2f5a] px-7 py-3.5 font-medium text-white transition-colors hover:bg-[#1e3a6e]"
          >
            <Phone size={14} />
            +46 (0)8-445 36 00
          </a>
          <a
            href="mailto:info@adcontact.se"
            className="flex items-center gap-2 rounded-lg border border-[#1e3a6e] bg-[#1a2f5a] px-7 py-3.5 font-medium text-white transition-colors hover:bg-[#1e3a6e]"
          >
            <Mail size={14} />
            info@adcontact.se
          </a>
        </div>
      </div>
    </section>
  );
}

/** Applications grid, dotted bullet list of use-cases. */
export function BrandApplications({
  title = "Where these connectors are used",
  applications,
}: {
  title?: string;
  applications: string[];
}) {
  return (
    <section id="applications" className="mb-20 scroll-mt-28">
      <SectionHeader eyebrow="Applications" title={title} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <div
            key={app}
            className="flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3"
          >
            <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2563eb]" />
            <span className="text-sm text-[#374151]">{app}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
