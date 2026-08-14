import type { Metadata } from "next";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "./site";
import {
  defaultLocale,
  localeMeta,
  locales,
  localizePath,
  type Locale,
} from "@/i18n/config";

/**
 * hreflang alternates for a bare path across all locales (docs/PLAN.md §8).
 * `canonical` is the current locale's URL; `languages` covers every locale +
 * `x-default` → English. Generated from `i18n/config.ts` (one source).
 */
export function localeAlternates(barePath: string, locale: Locale) {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[localeMeta[l].hreflang] = `${SITE_URL}${localizePath(barePath, l)}`;
  }
  languages["x-default"] = `${SITE_URL}${localizePath(barePath, defaultLocale)}`;
  return {
    canonical: `${SITE_URL}${localizePath(barePath, locale)}`,
    languages,
  };
}

/**
 * OG + Twitter card for pages that build their own `title`/`alternates` but would
 * otherwise inherit the root layout's `openGraph` (whose `url` is the homepage),
 * leaving og:url ≠ canonical and no page-specific card. Spread the result into
 * the returned metadata. `canonical` should be the page's own canonical URL
 * (relative is fine — resolved against `metadataBase`).
 */
export function socialCard(
  canonical: string,
  title: string,
  description?: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title,
      ...(description ? { description } : {}),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
      images: [OG_IMAGE],
    },
  };
}

/**
 * Per-page metadata helper (docs/PLAN.md §7–8, per the nextjs-seo-website skill).
 *
 * Sets a unique OG image per page (a page defining its own `openGraph` does NOT
 * inherit the root card) and full hreflang alternates + a per-locale canonical.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale = defaultLocale,
  ogTitle,
}: {
  /** Without the brand suffix — the layout title template adds it. */
  title: string;
  description: string;
  /** Bare, locale-independent path, e.g. "/pricing" ("/" for home). */
  path: string;
  locale?: Locale;
  ogTitle?: string;
}): Metadata {
  const alternates = localeAlternates(path, locale);
  const socialTitle = ogTitle ?? `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      url: alternates.canonical,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
