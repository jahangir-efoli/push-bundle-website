"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { getConsent } from "@/components/layout/cookie-consent";

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
const PROD_HOSTS = new Set(["pushbundle.com", "www.pushbundle.com"]);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
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
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const evaluate = () =>
      setEnabled(
        PROD_HOSTS.has(window.location.hostname) &&
          getConsent() === "granted",
      );
    evaluate();
    window.addEventListener("pb-consent-change", evaluate);
    window.addEventListener("storage", evaluate);
    return () => {
      window.removeEventListener("pb-consent-change", evaluate);
      window.removeEventListener("storage", evaluate);
    };
  }, []);

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
