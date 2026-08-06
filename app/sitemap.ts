import type { MetadataRoute } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo/site";
import { localeMeta, locales, localizePath } from "@/i18n/config";

/** Absolute URL for a bare path in a locale (no trailing slash on the home). */
function absUrl(barePath: string, locale: (typeof locales)[number]): string {
  const p = localizePath(barePath, locale);
  return `${SITE_URL}${p === "/" ? "" : p}`;
}

/** hreflang alternates for a bare path across all locales (§8). */
function alternates(barePath: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].hreflang] = absUrl(barePath, l);
  return { languages };
}

/**
 * One <url> entry PER LOCALE for a bare path (each localized URL is a real,
 * self-canonical page — the site is fully translated), every entry carrying the
 * full hreflang alternate set. So N paths → N × locales entries.
 */
function localizedEntries(
  barePath: string,
  meta: {
    lastModified: Date;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  },
): MetadataRoute.Sitemap {
  const langs = alternates(barePath);
  return locales.map((l) => ({
    url: absUrl(barePath, l),
    lastModified: meta.lastModified,
    changeFrequency: meta.changeFrequency,
    priority: meta.priority,
    alternates: langs,
  }));
}

/**
 * Auto-updating sitemap (docs/PLAN.md §4.3).
 *
 * Combines static routes with live CMS content refs, so publishing new content
 * adds it automatically. Resilient: if the CMS is unavailable, it falls back to
 * the static routes rather than emitting an empty sitemap. Revalidated so a bad
 * generation self-heals quickly.
 *
 * (hreflang alternates per locale are added in Phase 8 with i18n routing.)
 */
export const revalidate = 900;

const STATIC_PATHS: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/features", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/about-us", priority: 0.6 },
  { path: "/contact-us", priority: 0.6 },
  { path: "/faq", priority: 0.7 },
  { path: "/partner", priority: 0.5 },
  { path: "/blog", priority: 0.8 },
  { path: "/docs", priority: 0.7 },
  { path: "/changelog", priority: 0.5 },
  { path: "/privacy-policy", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((p) =>
    localizedEntries(p.path, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: p.priority,
    }),
  );

  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const refs = await cms.listAllContentRefs({ locale: DEFAULT_LOCALE });
    dynamicEntries = refs.flatMap((ref) =>
      localizedEntries(ref.path, {
        lastModified: ref.updatedAt ? new Date(ref.updatedAt) : now,
        changeFrequency: "monthly",
        priority: 0.5,
      }),
    );
  } catch {
    // Resilience: never emit an empty/static-only sitemap silently is worse —
    // but a CMS blip shouldn't drop the static routes. Log-and-continue.
    dynamicEntries = [];
  }

  return [...staticEntries, ...dynamicEntries];
}
