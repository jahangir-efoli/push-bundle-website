import { localeMeta, type Locale } from "@/i18n/config";

/** Join conditional class names. Tiny local helper — no extra dependency. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Interpolate `{name}` placeholders in a template string. Only placeholders
 * present in the (per-locale) template are substituted, so a locale that omits
 * an English-only token (e.g. a plural `{s}`) simply drops it.
 */
export function fmt(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in params ? String(params[key]) : `{${key}}`,
  );
}

/** Locale-aware short date ("Sep 28, 2026" / "2026年9月28日" …). */
export function formatShortDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeMeta[locale].hreflang, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
