import type { MetadataRoute } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo/site";
import { locales, localizePath } from "@/i18n/config";

/**
 * XML sitemap (docs/PLAN.md §4.3). A plain `app/sitemap.ts` so browsers render
 * their own native XML tree view (matching multivariants) — deliberately WITHOUT
 * sitemap-level `alternates.languages`, whose `<xhtml:link>` tags make Chrome
 * refuse to pretty-print and drop to flat text. hreflang is still delivered on
 * every page's `<head>` (see `localeAlternates`), so nothing is lost for search.
 *
 * One `<url>` PER LOCALE for every path (the site is fully translated). Live CMS
 * content is pulled in (fetch tag "cms" → busted by /api/revalidate); a CMS blip
 * falls back to the static routes. `revalidate` keeps a bad generation short.
 */
export const revalidate = 900;

const STATIC_PATHS: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/partner", priority: 0.5, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs", priority: 0.7, changeFrequency: "weekly" },
  { path: "/changelog", priority: 0.5, changeFrequency: "weekly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
];

/** Absolute URL for a bare path in a locale (no trailing slash on the home). */
function absUrl(barePath: string, locale: (typeof locales)[number]): string {
  const p = localizePath(barePath, locale);
  return `${SITE_URL}${p === "/" ? "" : p}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: Array<{
    path: string;
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = STATIC_PATHS.map((p) => ({
    path: p.path,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  try {
    const refs = await cms.listAllContentRefs({ locale: DEFAULT_LOCALE });
    for (const ref of refs) {
      entries.push({
        path: ref.path,
        lastModified: ref.updatedAt ? new Date(ref.updatedAt) : now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // Resilience: a CMS blip shouldn't drop the static routes.
  }

  // Expand every path into one entry per locale (fully translated site).
  return entries.flatMap((e) =>
    locales.map((locale) => ({
      url: absUrl(e.path, locale),
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
    })),
  );
}
