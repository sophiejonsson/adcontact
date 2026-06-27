import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | Adcontact",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Policies", href: "/policies" }, { label: "Privacy Policy" }]} />
      <h1 className="text-2xl font-bold text-[#0a1628] mt-4 mb-6">Privacy Policy</h1>
      <div className="prose prose-sm text-[#374151] leading-7 space-y-4 max-w-2xl">
        <p>
          We respect your privacy. We may collect information you provide (like name or email) and non-personal info (like IP addresses or browser data) to improve our website and services. We do not sell our data and only share it with trusted partners or as required by law.
        </p>
        <p>
          By using our site, you agree to this policy.
        </p>
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
