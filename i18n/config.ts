/**
 * i18n configuration — the single source of truth for locales (docs/PLAN.md §8).
 *
 * Native Next.js 16 approach (not next-intl): next-intl relies on edge
 * middleware, which Next 16's `proxy` no longer supports. Routing lives in
 * `proxy.ts`; content in `messages/{locale}.json` via `i18n/dictionaries.ts`.
 *
 * Adding/removing a language is a one-file change here — it drives routing,
 * the switcher, hreflang, and the sitemap.
 */

export const locales = ["en", "de", "fr", "es", "it", "ja", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Per-locale metadata: native name (for the switcher) + hreflang code. */
export const localeMeta: Record<
  Locale,
  { name: string; hreflang: string; flag: string }
> = {
  en: { name: "English", hreflang: "en", flag: "🇺🇸" },
  de: { name: "Deutsch", hreflang: "de", flag: "🇩🇪" },
  fr: { name: "Français", hreflang: "fr", flag: "🇫🇷" },
  es: { name: "Español", hreflang: "es", flag: "🇪🇸" },
  it: { name: "Italiano", hreflang: "it", flag: "🇮🇹" },
  ja: { name: "日本語", hreflang: "ja", flag: "🇯🇵" },
  zh: { name: "简体中文", hreflang: "zh-Hans", flag: "🇨🇳" },
};

/** Locales needing CJK glyph coverage — fonts loaded only for these (§8 perf). */
export const cjkLocales: Locale[] = ["ja", "zh"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * URL path for a route in a given locale. Default locale is unprefixed
 * (`/pricing`); others are prefixed (`/de/pricing`). (§8 "as-needed")
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path;
  return locale === defaultLocale ? clean || "/" : `/${locale}${clean}`;
}
