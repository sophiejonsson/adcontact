"use client";

import { useEffect, useState } from "react";
import { getConsent, CONSENT_EVENT, type ConsentValue } from "@/lib/consent";

/**
 * Current cookie-consent value. Returns null on the first (server/hydration)
 * render, then the stored value after mount, and updates live when the visitor
 * makes a choice (or changes it in another tab).
 */
export function useConsent(): ConsentValue | null {
  const [consent, setConsentState] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsentState(getConsent());
    const handler = () => setConsentState(getConsent());
    window.addEventListener(CONSENT_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return consent;
}
