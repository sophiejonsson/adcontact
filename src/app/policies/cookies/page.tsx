import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cookie Policy | Adcontact",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Policies", href: "/policies" }, { label: "Cookie Policy" }]} />
      <h1 className="text-2xl font-bold text-[#0a1628] mt-4 mb-6">Cookie Policy</h1>
      <div className="prose prose-sm text-[#374151] leading-7 space-y-4 max-w-2xl">
        <p>
          Our website uses cookies to improve your experience, analyze site traffic, and remember your preferences. By using our site, you agree to our use of cookies.
        </p>
        <p>You can manage or delete cookies in your browser settings.</p>
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
