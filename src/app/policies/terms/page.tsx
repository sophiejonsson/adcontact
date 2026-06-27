import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "General Terms of Delivery | Adcontact",
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Policies", href: "/policies" }, { label: "General Terms of Delivery" }]} />
      <h1 className="text-2xl font-bold text-[#0a1628] mt-4 mb-6">General Terms of Delivery</h1>
      <div className="prose prose-sm text-[#374151] leading-7 space-y-4 max-w-2xl">
        <p>IML 2009</p>
        <p>
          For further questions feel free to contact us by using the form under "Contact us".
        </p>
        <p className="font-medium">Thank you!</p>
      </div>
      <div className="mt-8 pt-6 border-t border-[#f1f5f9]">
        <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
          Contact us <ArrowRight size={13} />
        </Link>
      </div>
    </>
  );
}
