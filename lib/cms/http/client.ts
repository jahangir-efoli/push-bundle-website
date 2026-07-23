import "server-only";

/**
 * CMS fetch helper (docs/PLAN.md §7 CMS; API ref in the Phase 9 brief).
 *
 * The base URL and site slug come ENTIRELY from env — no hardcoded fallback URL,
 * so pointing at a different CMS is a one-line env change:
 *   CMS_SITE_URL — base origin, e.g. https://efoli-cms.vercel.app (the API paths
 *                  like /api/public/posts are appended here in code). A trailing
 *                  slash is tolerated.
 *   CMS_SITE     — site slug, sent as `?site=`.
 * If CMS_SITE_URL is unset, the adapter serves the local fixtures instead of
 * hitting the network (CMS_ENABLED is false).
 *
 * Caching: cache indefinitely + tag "cms"; the CMS pushes updates via
 * /api/revalidate (revalidateTag). Never caches forever without that route.
 */
export const CMS_BASE = (process.env.CMS_SITE_URL ?? "").trim().replace(/\/+$/, "");

export const CMS_SITE = (process.env.CMS_SITE ?? "").trim();

/**
 * True when a CMS base is configured — otherwise the site uses fixtures only.
 * `CMS_USE_FIXTURES=1` force-selects the fixtures (no network at all), giving the
 * e2e suite a deterministic dataset independent of whatever `CMS_SITE` points at.
 */
const FORCE_FIXTURES = /^(1|true)$/i.test(process.env.CMS_USE_FIXTURES ?? "");
export const CMS_ENABLED = Boolean(CMS_BASE) && !FORCE_FIXTURES;

export async function cmsFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const qs = new URLSearchParams({ site: CMS_SITE });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }

  const res = await fetch(`${CMS_BASE}${path}?${qs}`, {
    next: { tags: ["cms"] },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`CMS ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}
