import { NextResponse, type NextRequest } from "next/server";
import { INDEXABLE_HOSTS } from "@/lib/seo/site";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Locale routing + staging noindex (docs/PLAN.md §8, §7).
 *
 * Next.js 16 renamed `middleware` → `proxy`. This handles:
 *  1. Locale routing (as-needed prefix): default locale (`en`) is served
 *     UNPREFIXED by internally rewriting `/pricing` → `/en/pricing`, so the URL
 *     stays clean. Prefixed locales (`/de/pricing`) pass through. `/en/*` 301s
 *     to the unprefixed form so there's one canonical URL per page.
 *  2. Staging noindex: `X-Robots-Tag` on any non-production host.
 */

// Files (have an extension) and non-localized SEO routes must not be rewritten.
const PUBLIC_FILE = /\.[^/]+$/;
const SEO_ROUTES = new Set(["/og-image"]);

function withNoindex(res: NextResponse, host: string) {
  if (!INDEXABLE_HOSTS.has(host)) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();

  // API routes, SEO route handlers + static files: pass through (never locale-
  // rewritten; still noindex on staging).
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    PUBLIC_FILE.test(pathname) ||
    SEO_ROUTES.has(pathname)
  ) {
    return withNoindex(NextResponse.next(), host);
  }

  // `/en` is the unprefixed default → 301 to strip the prefix.
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Prefixed non-default locale → serve app/[lang] directly.
  const firstSegment = pathname.split("/")[1] ?? "";
  if (isLocale(firstSegment) && firstSegment !== defaultLocale) {
    return withNoindex(NextResponse.next(), host);
  }

  // Unprefixed path → rewrite to the default locale internally (URL unchanged).
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return withNoindex(NextResponse.rewrite(url), host);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
