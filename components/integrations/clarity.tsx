"use client";

import { useEffect, useRef } from "react";
import { useAnalyticsAllowed } from "@/components/integrations/analytics";

/**
 * Microsoft Clarity (heatmaps + session recordings): lazy and consent-gated.
 *
 * Same gate as GA4 (`useAnalyticsAllowed`): production host AND cookie consent
 * granted. So it never records dev/preview traffic, and it keeps the cookie
 * banner's promise that analytics "load only if you accept".
 *
 * No load-speed cost: the tag is injected only after the visitor's first
 * interaction (or an idle fallback), and even then inside an idle callback, so
 * it never competes with LCP, hydration or the interaction that triggered it.
 * Lighthouse/PageSpeed never grant consent, so audits never load it at all.
 *
 * No errors: all window access happens in an effect (nothing runs during SSR),
 * a window flag stops double injection across remounts and locale switches,
 * and if an ad blocker blocks clarity.ms the `window.clarity` stub just keeps
 * queuing, so nothing throws. Clarity follows SPA route changes on its own, so
 * no page-view wiring is needed.
 */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "rnip1ugwry";
const IDLE_FALLBACK_MS = 5000;

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };
type ClarityWindow = Window & {
  clarity?: ClarityFn;
  __pbClarityLoaded?: boolean;
};

/**
 * Clarity Consent API v2. The banner asks about analytics cookies only, so ad
 * storage is always denied.
 */
function sendConsent(granted: boolean) {
  (window as ClarityWindow).clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: granted ? "granted" : "denied",
  });
}

function loadClarity() {
  const w = window as ClarityWindow;
  if (w.__pbClarityLoaded) return;
  w.__pbClarityLoaded = true;

  // Microsoft's official stub: queue calls until the tag arrives. It must push
  // the `arguments` object, exactly as the vendor snippet does.
  if (typeof w.clarity !== "function") {
    const stub: ClarityFn = function () {
      // eslint-disable-next-line prefer-rest-params -- vendor queue format
      (stub.q = stub.q || []).push(arguments);
    };
    w.clarity = stub;
  }
  sendConsent(true); // queued; applied as soon as the tag loads

  const s = document.createElement("script");
  s.id = "ms-clarity";
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_ID)}`;
  document.head.appendChild(s);
}

export function Clarity() {
  const allowed = useAnalyticsAllowed();
  const wasAllowed = useRef(false);

  useEffect(() => {
    const w = window as ClarityWindow;

    if (!allowed) {
      // Consent withdrawn after Clarity ran (e.g. declined in another tab).
      // Microsoft makes the site responsible for passing this on: Clarity then
      // deletes its _clck/_clsk cookies and ends the session. On the next page
      // load the gate is closed, so the tag isn't loaded at all.
      if (wasAllowed.current && w.__pbClarityLoaded) sendConsent(false);
      wasAllowed.current = false;
      return;
    }
    wasAllowed.current = true;

    if (w.__pbClarityLoaded) {
      sendConsent(true); // re-granted after a withdrawal
      return;
    }

    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "mousemove",
      "touchstart",
      "keydown",
      "click",
    ];
    let cancelIdle: (() => void) | undefined;

    const removeTriggers = () => {
      events.forEach((e) => window.removeEventListener(e, trigger));
      window.clearTimeout(fallback);
    };
    // Defer to idle time so loading never delays the triggering interaction (INP).
    const trigger = () => {
      removeTriggers();
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(loadClarity, { timeout: 2000 });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(loadClarity, 0); // Safari
        cancelIdle = () => window.clearTimeout(id);
      }
    };

    const fallback = window.setTimeout(trigger, IDLE_FALLBACK_MS);
    const opts: AddEventListenerOptions = { once: true, passive: true };
    events.forEach((e) => window.addEventListener(e, trigger, opts));

    return () => {
      removeTriggers();
      cancelIdle?.();
    };
  }, [allowed]);

  return null;
}
