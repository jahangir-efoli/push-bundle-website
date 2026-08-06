import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo/site";
import { localeMeta, locales, localizePath } from "@/i18n/config";

/**
 * XML sitemap (docs/PLAN.md §4.3) — a custom route (not `app/sitemap.ts`) so it
 * can carry an `<?xml-stylesheet?>` PI. Chrome refuses to pretty-print a sitemap
 * that contains hreflang `<xhtml:link>` alternates, so the stylesheet gives a
 * readable view in every browser while keeping the (valuable) language data.
 * Search engines ignore the stylesheet and read the raw XML.
 *
 * One `<url>` PER LOCALE for every path (the site is fully translated), each with
 * the full hreflang set. Live CMS content is pulled in (fetch tag "cms" → busted
 * by /api/revalidate). Resilient: a CMS blip falls back to the static routes.
 * Revalidated so a bad generation self-heals quickly.
 */
export const revalidate = 900;

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

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

/** Absolute URL for a bare path in a locale (no trailing slash on the home). */
function absUrl(barePath: string, locale: (typeof locales)[number]): string {
  const p = localizePath(barePath, locale);
  return `${SITE_URL}${p === "/" ? "" : p}`;
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Entry = {
  path: string;
  lastmod: string;
  changefreq: "weekly" | "monthly";
  priority: number;
};

/** Expand one bare path into a `<url>` per locale, each with the hreflang set. */
function urlBlocks(e: Entry): string {
  const alternates = locales
    .map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${localeMeta[l].hreflang}" href="${xmlEscape(
          absUrl(e.path, l),
        )}"/>`,
    )
    .join("\n");

  return locales
    .map(
      (l) =>
        `  <url>\n    <loc>${xmlEscape(absUrl(e.path, l))}</loc>\n${alternates}\n` +
        `    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n");
}

export async function GET() {
  const now = new Date().toISOString();

  const entries: Entry[] = STATIC_PATHS.map((p) => ({
    path: p.path,
    lastmod: now,
    changefreq: "weekly",
    priority: p.priority,
  }));

  try {
    const refs = await cms.listAllContentRefs({ locale: DEFAULT_LOCALE });
    for (const ref of refs) {
      entries.push({
        path: ref.path,
        lastmod: ref.updatedAt ? new Date(ref.updatedAt).toISOString() : now,
        changefreq: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // Resilience: a CMS blip shouldn't drop the static routes.
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n` +
    `<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="${XHTML_NS}">\n` +
    entries.map(urlBlocks).join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
