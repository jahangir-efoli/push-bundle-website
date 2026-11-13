"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { getConsent } from "@/components/layout/cookie-consent";
import { isProductionHost } from "@/lib/production-hosts";

/**
 * Google Analytics 4 (gtag.js) — docs/PLAN.md §8, nextjs-seo-website §8.
 *
 * Loaded ONLY when both hold, so it never pollutes the GA property from dev or
 * preview and honours the cookie banner's promise ("load only if you accept"):
 *   1. the page is served from the canonical production host, and
 *   2. the visitor has granted analytics consent (`pb-consent` = "granted").
 *
 * Declining, or no decision yet, means gtag.js is never injected. Grant made
 * mid-session (via the banner) mounts it immediately. SPA route changes fire a
 * `page_view` (the first is skipped — `gtag('config')` already sent one).
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-B1LF6XE73Y";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * GA4's gate: true only on the production host AND with `pb-consent` =
 * "granted". Re-evaluates when the banner decides (this tab) or localStorage
 * changes (another tab). Always false during SSR/hydration, so nothing
 * analytics-related is server-rendered.
 */
function subscribeConsent(onChange: () => void) {
  window.addEventListener("pb-consent-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("pb-consent-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}
const analyticsAllowed = () =>
  isProductionHost(window.location.hostname) && getConsent() === "granted";
const analyticsAllowedOnServer = () => false;

export function useAnalyticsAllowed(): boolean {
  return useSyncExternalStore(
    subscribeConsent,
    analyticsAllowed,
    analyticsAllowedOnServer,
  );
}

/**
 * Send a custom GA4 event. A no-op until gtag.js is loaded — i.e. off the
 * production host or without consent — so callers never need to check.
 */
export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

/** Send a page_view on client-side navigation (config sends the first one). */
function GaPageviews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;
    const qs = searchParams?.toString();
    window.gtag("event", "page_view", {
      page_path: qs ? `${pathname}?${qs}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  const enabled = useAnalyticsAllowed();

  if (!enabled) return null;

  return (
    <>
      <Script
        id="ga-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
      <Suspense fallback={null}>
        <GaPageviews />
      </Suspense>
    </>
  );
}
