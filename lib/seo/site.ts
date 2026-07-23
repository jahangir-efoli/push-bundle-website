/** Canonical site constants for SEO (docs/PLAN.md §7). */
export const SITE_URL = "https://pushbundle.com";
export const SITE_NAME = "PushBundle";
export const OG_IMAGE = "/og-image";

/**
 * Hostnames that are NOT noindexed (§7). The production domain(s), plus local
 * dev — localhost is never publicly crawlable, so noindexing it only makes
 * local Lighthouse SEO misleading. Real staging domains (*.vercel.app, etc.)
 * are absent, so they still get `X-Robots-Tag: noindex`.
 */
export const INDEXABLE_HOSTS = new Set([
  "pushbundle.com",
  "www.pushbundle.com",
  "localhost",
  "127.0.0.1",
]);
