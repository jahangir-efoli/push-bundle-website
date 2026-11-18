import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { CMS_ENABLED, CmsHttpError, cmsFetch } from "./http/client";
import { previewFetch } from "./preview";
import type { LandingPage, LandingPageRef } from "./types";

/**
 * CMS landing pages (served at the site root, `/<slug>`, English only).
 *
 * Published pages go through `cmsFetch` (tag "cms" → busted by /api/revalidate,
 * plus its time-based safety net and transient-error retry). In draft mode the
 * request carries the preview token and is uncached, so an editor sees the
 * newest draft. A 404 means "no such page" → null, so the route can `notFound()`
 * (a root `[slug]` catches every unknown URL; real 404s must stay 404s). Any
 * other failure throws, so a CMS outage is a 5xx — never a 404 a crawler would
 * use to drop the page.
 *
 * In fixture mode (no CMS configured, or CMS_USE_FIXTURES=1) there are no
 * landing pages, so every root slug 404s.
 */

const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v : null;

/** Tolerant read of the API body: missing booleans default to the CMS defaults. */
function normalize(raw: Record<string, unknown>): LandingPage {
  return {
    id: String(raw.id ?? ""),
    title: str(raw.title) ?? "",
    slug: String(raw.slug ?? ""),
    content: typeof raw.content === "string" ? raw.content : "",
    showHeader: raw.showHeader !== false,
    showFooter: raw.showFooter !== false,
    metaTitle: str(raw.metaTitle),
    metaDescription: str(raw.metaDescription),
    ogImage: str(raw.ogImage),
    canonicalUrl: str(raw.canonicalUrl),
    noIndex: raw.noIndex === true,
    publishedAt: str(raw.publishedAt),
    updatedAt: str(raw.updatedAt),
    status: str(raw.status) ?? undefined,
    isPreview: raw.isPreview === true,
  };
}

/**
 * One landing page by slug, or null when there is none. `cache()` dedupes the
 * calls made by the layout, `generateMetadata` and the page in one request.
 */
export const getLandingPage = cache(
  async (slug: string): Promise<LandingPage | null> => {
    if (!CMS_ENABLED || !slug) return null;
    const path = `/api/public/landing-pages/${encodeURIComponent(slug)}`;

    if ((await draftMode()).isEnabled) {
      const raw = await previewFetch<Record<string, unknown>>(path);
      return raw ? normalize(raw) : null;
    }

    try {
      return normalize(await cmsFetch<Record<string, unknown>>(path));
    } catch (err) {
      if (err instanceof CmsHttpError && err.status === 404) return null;
      throw err;
    }
  },
);

/** Published landing pages (no content), for the sitemap. Throws on failure. */
export async function listLandingPages(): Promise<LandingPageRef[]> {
  if (!CMS_ENABLED) return [];
  const { pages } = await cmsFetch<{ pages?: LandingPageRef[] }>(
    "/api/public/landing-pages",
  );
  return Array.isArray(pages) ? pages : [];
}
