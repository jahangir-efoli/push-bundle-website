/**
 * The site-wide promotion shown in the bar above the navbar on every page.
 *
 * To run a new campaign, edit this object and the `promo` copy in
 * `messages/{locale}.json`. The bar stops rendering once `endsAt` passes —
 * server-side for any render after the deadline, and client-side for pages
 * that were prerendered before it (see components/layout/promo-banner.tsx).
 */
export const promo = {
  code: "BFCM26",
  discount: "30%",
  href: "https://partners.efoli.com/install/pushbundle/BFCM26",
  // End of Dec 12 in US Pacific time (PST, UTC−8).
  endsAt: Date.parse("2026-12-12T23:59:59-08:00"),
  timeZone: "America/Los_Angeles",
} as const;

export function isPromoLive(now: number = Date.now()): boolean {
  return now < promo.endsAt;
}

/** The end date as a reader of `hreflang` writes it: "December 12", "12. Dezember", "12月12日". */
export function formatPromoEnd(hreflang: string): string {
  return new Intl.DateTimeFormat(hreflang, {
    month: "long",
    day: "numeric",
    timeZone: promo.timeZone,
  }).format(promo.endsAt);
}
