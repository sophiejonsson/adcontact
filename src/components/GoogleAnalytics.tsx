"use client";

import Script from "next/script";
import { useConsent } from "@/lib/useConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads Google Analytics (GA4) only after the visitor accepts analytics cookies
 * ("Accept all"). Nothing loads — no gtag script, no GA cookies, no network
 * calls to Google — until then. Renders nothing if no Measurement ID is set.
 */
export default function GoogleAnalytics() {
  const consent = useConsent();
  if (!GA_ID || consent !== "all") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
