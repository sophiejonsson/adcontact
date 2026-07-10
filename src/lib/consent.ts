// Minimal first-party cookie-consent store. Consent is "all" (accept
// non-essential cookies: analytics + embedded video) or "necessary" (essential
// only). Nothing non-essential — Google Analytics, YouTube — runs until the
// visitor chooses "all". No third-party CMP; the choice lives in localStorage.

export type ConsentValue = "all" | "necessary";

const STORAGE_KEY = "adc-cookie-consent";
export const CONSENT_EVENT = "adc-consent-change";
export const CONSENT_OPEN_EVENT = "adc-consent-open";

// Re-open the consent banner (e.g. from a footer "Cookie settings" link) so a
// visitor can change or withdraw their choice at any time.
export function openConsentSettings(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "all" || v === "necessary" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage blocked — treat as no consent */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

// Privacy-enhanced YouTube domain — fewer cookies until playback.
export function toNoCookieEmbed(src: string): string {
  return src
    .replace("www.youtube.com/embed", "www.youtube-nocookie.com/embed")
    .replace("//youtube.com/embed", "//youtube-nocookie.com/embed");
}
