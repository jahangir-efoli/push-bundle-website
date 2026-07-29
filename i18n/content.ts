import "server-only";
import { defaultLocale, type Locale } from "./config";

/**
 * Per-page / shared static content loader (docs/PLAN.md §8).
 *
 * Marketing copy that used to live in `lib/content/*.ts` (English only) is being
 * localized into `messages/<namespace>/<locale>.json`, one JSON file per
 * language so translators can work a page at a time. Each loader falls back to
 * English so a missing or partial translation never renders empty.
 *
 * Namespaces:
 *  - `common`   — site-wide shared strings (trial CTA, reviews/FAQ headings,
 *                 shared buttons, demo labels) reused across pages.
 *  - `features` — the Features page (`app/[lang]/features`).
 *  - `pricing`  — the Pricing page (`app/[lang]/pricing`). Only text lives here;
 *                 prices/flags stay in `lib/content/pricing.ts` (single source of
 *                 truth) and are merged with this text, by index, in the page.
 */

// --- common ---------------------------------------------------------------
import type commonEn from "@/messages/common/en.json";
export type CommonContent = typeof commonEn;

const commonLoaders: Record<Locale, () => Promise<{ default: CommonContent }>> = {
  en: () => import("@/messages/common/en.json"),
  de: () => import("@/messages/common/de.json"),
  fr: () => import("@/messages/common/fr.json"),
  es: () => import("@/messages/common/es.json"),
  it: () => import("@/messages/common/it.json"),
  ja: () => import("@/messages/common/ja.json"),
  zh: () => import("@/messages/common/zh.json"),
};

export async function getCommon(locale: Locale): Promise<CommonContent> {
  try {
    return (await commonLoaders[locale]()).default;
  } catch {
    return (await commonLoaders[defaultLocale]()).default;
  }
}

// --- features -------------------------------------------------------------
import type featuresEn from "@/messages/features/en.json";
export type FeaturesContent = typeof featuresEn;

const featuresLoaders: Record<Locale, () => Promise<{ default: FeaturesContent }>> = {
  en: () => import("@/messages/features/en.json"),
  de: () => import("@/messages/features/de.json"),
  fr: () => import("@/messages/features/fr.json"),
  es: () => import("@/messages/features/es.json"),
  it: () => import("@/messages/features/it.json"),
  ja: () => import("@/messages/features/ja.json"),
  zh: () => import("@/messages/features/zh.json"),
};

export async function getFeaturesContent(locale: Locale): Promise<FeaturesContent> {
  try {
    return (await featuresLoaders[locale]()).default;
  } catch {
    return (await featuresLoaders[defaultLocale]()).default;
  }
}

// --- pricing --------------------------------------------------------------
import type pricingEn from "@/messages/pricing/en.json";
export type PricingContent = typeof pricingEn;

const pricingLoaders: Record<Locale, () => Promise<{ default: PricingContent }>> = {
  en: () => import("@/messages/pricing/en.json"),
  de: () => import("@/messages/pricing/de.json"),
  fr: () => import("@/messages/pricing/fr.json"),
  es: () => import("@/messages/pricing/es.json"),
  it: () => import("@/messages/pricing/it.json"),
  ja: () => import("@/messages/pricing/ja.json"),
  zh: () => import("@/messages/pricing/zh.json"),
};

export async function getPricingContent(locale: Locale): Promise<PricingContent> {
  try {
    return (await pricingLoaders[locale]()).default;
  } catch {
    return (await pricingLoaders[defaultLocale]()).default;
  }
}
