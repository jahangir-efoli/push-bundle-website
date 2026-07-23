import "server-only";
import { defaultLocale, type Locale } from "./config";

/**
 * Server-side dictionary loader (docs/PLAN.md §8). Loads `messages/{locale}.json`
 * with an English fallback — a missing/partial locale never renders empty.
 *
 * The 6 non-English files are English placeholders today; translators (or the
 * CMS, for dynamic content) fill them in later. Adding a locale = one entry in
 * `i18n/config.ts` + a `messages/{locale}.json`.
 */
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import("@/messages/en.json"),
  de: () => import("@/messages/de.json"),
  fr: () => import("@/messages/fr.json"),
  es: () => import("@/messages/es.json"),
  it: () => import("@/messages/it.json"),
  ja: () => import("@/messages/ja.json"),
  zh: () => import("@/messages/zh.json"),
};

export type Dictionary = typeof import("@/messages/en.json");

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    return (await loaders[locale]()).default;
  } catch {
    return (await loaders[defaultLocale]()).default;
  }
}
