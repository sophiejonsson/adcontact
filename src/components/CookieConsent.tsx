"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent, CONSENT_OPEN_EVENT, type ConsentValue } from "@/lib/consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show on first visit (no choice yet)...
    setShow(getConsent() === null);
    // ...or whenever the visitor re-opens it from the footer.
    const open = () => setShow(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  if (!show) return null;

  const choose = (value: ConsentValue) => {
    setConsent(value);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#1a2f5a] bg-[#0a1628] px-4 py-4 text-white shadow-[0_-8px_28px_-14px_rgba(0,0,0,0.6)] sm:px-6"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-xs leading-relaxed text-[#cbd5e1] sm:max-w-2xl">
          We use essential cookies to run the site. With your consent we also use
          cookies for analytics and to show embedded videos. See our{" "}
          <Link
            href="/policies/cookies"
            className="font-semibold text-[#60a5fa] underline underline-offset-2 hover:text-white"
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("necessary")}
            className="rounded-lg border border-[#334155] px-4 py-2 text-xs font-semibold text-[#cbd5e1] transition-colors hover:border-[#60a5fa] hover:text-white"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
