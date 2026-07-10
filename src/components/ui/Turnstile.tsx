"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Whether a captcha is configured. When false, forms render no widget and
// don't require a token, so everything keeps working before the keys exist.
export const CAPTCHA_ENABLED = Boolean(SITE_KEY);

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile widget. Calls `onToken` with the verification token when
 * solved, and with "" on error/expiry. Renders nothing when no site key is
 * configured (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
 */
export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let removed = false;
    loadScript()
      .then(() => {
        if (removed || !containerRef.current || !window.turnstile || idRef.current) return;
        idRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => onTokenRef.current(token),
          "error-callback": () => onTokenRef.current(""),
          "expired-callback": () => onTokenRef.current(""),
        });
      })
      .catch(() => onTokenRef.current(""));
    return () => {
      removed = true;
      if (idRef.current && window.turnstile) {
        try {
          window.turnstile.remove(idRef.current);
        } catch {
          /* widget already gone */
        }
        idRef.current = null;
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="mt-1" />;
}
