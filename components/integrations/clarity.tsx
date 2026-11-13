"use client";

import { useEffect } from "react";
import { getConsent } from "@/components/layout/cookie-consent";
import { isProductionHost } from "@/lib/production-hosts";

/**
 * Microsoft Clarity (session recordings + heatmaps) for EVERY visitor, the
 * same set-up as multivariants.com.
 *
 * - Where: only on the production domain (lib/production-hosts.ts), so local
 *   dev, preview deploys and *.vercel.app never reach the Clarity project.
 * - When: after the visitor's first scroll / mousemove / touchstart / keydown /
 *   click, or a 5 s idle fallback, whichever comes first. Even then the tag is
 *   added inside an idle callback, so it never delays page load, LCP or the
 *   interaction that triggered it.
 * - Loading never depends on the cookie banner. The banner only decides
 *   whether Clarity may use cookies, which keeps its "analytics cookies load
 *   only if you accept" promise true:
 *     - no decision / declined: no-consent mode. No _clck/_clsk cookies, and
 *       each page view is its own recording (as on multivariants.com).
 *     - accepted: cookies on, so a visitor's pages are stitched into one
 *       session. Switches live when they click Accept, no reload needed.
 * - No errors: nothing runs during SSR, a window flag stops a second copy of
 *   the tag (Clarity warns "CL001" otherwise), and if an ad blocker stops the
 *   tag the queue stub just keeps queuing. Clarity follows client-side route
 *   changes on its own, so there's no page-view code.
 */

// Public project ID (it ships in the tag URL anyway). Override per environment
// with NEXT_PUBLIC_CLARITY_ID to point a deploy at a different project.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "rnip1ugwry";

const INTERACTION_EVENTS = [
  "scroll",
  "mousemove",
  "touchstart",
  "keydown",
  "click",
] as const;
const IDLE_FALLBACK_MS = 5000;
const IDLE_CALLBACK_TIMEOUT_MS = 2000;

type ClarityQueue = ((...args: unknown[]) => void) & { q?: IArguments[] };
type ClarityWindow = Window & {
  clarity?: ClarityQueue;
  /** Set once the tag is added, so remounts and locale switches never add a
   *  second copy. */
  __pbClarityLoaded?: boolean;
};

/**
 * Tell Clarity what the cookie banner currently allows (Consent API v2). Ad
 * storage is always denied: the banner only covers analytics cookies. Sending
 * an unchanged state is a no-op in Clarity, so this is safe to call often.
 */
function syncConsent(w: ClarityWindow) {
  w.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: getConsent() === "granted" ? "granted" : "denied",
  });
}

function addClarityTag(w: ClarityWindow) {
  if (w.__pbClarityLoaded) return;
  w.__pbClarityLoaded = true;

  // Microsoft's queue stub, kept in its original form: calls made before the
  // tag arrives are queued as the real `arguments` objects and replayed by
  // the tag.
  w.clarity =
    w.clarity ||
    function () {
      // eslint-disable-next-line prefer-rest-params -- vendor queue format
      (w.clarity!.q = w.clarity!.q || []).push(arguments);
    };
  syncConsent(w); // queued; applied as soon as the tag loads

  const script = document.createElement("script");
  script.id = "ms-clarity";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_ID)}`;
  document.head.appendChild(script);
}

export function Clarity() {
  useEffect(() => {
    if (!CLARITY_ID || !isProductionHost(window.location.hostname)) return;
    const w = window as ClarityWindow;

    // Banner decision in this tab, or in another tab via localStorage.
    // Accepting turns cookies on; declining after accepting makes Clarity
    // delete its cookies and carry on in no-consent mode.
    const onConsentChange = () => {
      if (w.__pbClarityLoaded) syncConsent(w);
    };
    window.addEventListener("pb-consent-change", onConsentChange);
    window.addEventListener("storage", onConsentChange);
    const removeConsentListeners = () => {
      window.removeEventListener("pb-consent-change", onConsentChange);
      window.removeEventListener("storage", onConsentChange);
    };

    if (w.__pbClarityLoaded) return removeConsentListeners;

    let scheduled = false;
    let idleId: number | undefined;
    let deferTimer: number | undefined;

    const add = () => addClarityTag(w);

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      removeTriggers();
      // Safari has no requestIdleCallback; a 0 ms timeout still moves the
      // work out of the interaction's event handler.
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(add, {
          timeout: IDLE_CALLBACK_TIMEOUT_MS,
        });
      } else {
        deferTimer = window.setTimeout(add, 0);
      }
    };

    const opts: AddEventListenerOptions = { once: true, passive: true };
    INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, schedule, opts));
    const fallbackTimer = window.setTimeout(schedule, IDLE_FALLBACK_MS);

    function removeTriggers() {
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, schedule));
      window.clearTimeout(fallbackTimer);
    }

    return () => {
      removeConsentListeners();
      removeTriggers();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (deferTimer !== undefined) window.clearTimeout(deferTimer);
    };
  }, []);

  return null;
}
