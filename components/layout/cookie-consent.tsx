"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Cookie consent banner — SHELL (docs/PLAN.md §7 GDPR).
 *
 * Phase 2 delivers the UI + persisted consent state. Phase 9 wires the
 * decision to the actual GA4 / Meta Pixel loaders, which must not fire
 * until `pb-consent` is "granted".
 *
 * Read elsewhere via getConsent(); listen for the `pb-consent-change` event.
 */

const STORAGE_KEY = "pb-consent";
export type Consent = "granted" | "denied";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/**
 * localStorage is an external store — read it with useSyncExternalStore so the
 * banner reacts to decisions made in this tab or another one.
 */
function subscribe(onChange: () => void) {
  window.addEventListener("pb-consent-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("pb-consent-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

const shouldAsk = () => getConsent() === null;
/** Never render during SSR: avoids flashing the banner at users who decided. */
const shouldAskOnServer = () => false;

export function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, shouldAsk, shouldAskOnServer);

  const decide = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // Non-persistent consent still applies for this page view.
    }
    window.dispatchEvent(
      new CustomEvent("pb-consent-change", { detail: consent }),
    );
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-xl border border-border bg-surface p-5 shadow-lift sm:inset-x-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h2 id="cookie-consent-title" className="font-semibold text-foreground">
            We use cookies
          </h2>
          <p className="mt-1 text-sm text-muted">
            We use analytics cookies to understand how the site is used. They
            load only if you accept. See our{" "}
            {/* Underlined, not colour-only — axe `link-in-text-block` (§6 a11y). */}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" size="sm" onClick={() => decide("denied")}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={() => decide("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
