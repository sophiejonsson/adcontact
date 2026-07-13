import { NextResponse, type NextRequest } from "next/server";

// Vercel auto-assigns this alias to every deployment on `main`; it serves the
// exact same site as www.adcontact.se and can't be turned off. Left alone, a
// crawler or shared link could treat it as a second, fully-indexable copy of
// the whole site. 301 it straight to the real domain, path and query intact.
//
// Scoped to this EXACT hostname only — do not widen to a *.vercel.app match,
// that would also catch branch preview deployments (adcontact-git-<branch>-
// adcgam.vercel.app) and break the preview-before-merge review workflow.
const VERCEL_PRODUCTION_ALIAS = "adcontact-pi.vercel.app";
const CANONICAL_HOST = "www.adcontact.se";

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname === VERCEL_PRODUCTION_ALIAS) {
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static assets and the media/image proxies, which don't need SEO
    // canonicalisation and would just add latency to every asset request.
    "/((?!_next/static|_next/image|favicon.ico|media/).*)",
  ],
};
