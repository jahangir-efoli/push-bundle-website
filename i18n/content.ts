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

// --- about ----------------------------------------------------------------
import type aboutEn from "@/messages/about/en.json";
export type AboutContent = typeof aboutEn;

const aboutLoaders: Record<Locale, () => Promise<{ default: AboutContent }>> = {
  en: () => import("@/messages/about/en.json"),
  de: () => import("@/messages/about/de.json"),
  fr: () => import("@/messages/about/fr.json"),
  es: () => import("@/messages/about/es.json"),
  it: () => import("@/messages/about/it.json"),
  ja: () => import("@/messages/about/ja.json"),
  zh: () => import("@/messages/about/zh.json"),
};

export async function getAboutContent(locale: Locale): Promise<AboutContent> {
  try {
    return (await aboutLoaders[locale]()).default;
  } catch {
    return (await aboutLoaders[defaultLocale]()).default;
  }
}

// --- contact --------------------------------------------------------------
import type contactEn from "@/messages/contact/en.json";
export type ContactContent = typeof contactEn;

const contactLoaders: Record<Locale, () => Promise<{ default: ContactContent }>> = {
  en: () => import("@/messages/contact/en.json"),
  de: () => import("@/messages/contact/de.json"),
  fr: () => import("@/messages/contact/fr.json"),
  es: () => import("@/messages/contact/es.json"),
  it: () => import("@/messages/contact/it.json"),
  ja: () => import("@/messages/contact/ja.json"),
  zh: () => import("@/messages/contact/zh.json"),
};

export async function getContactContent(locale: Locale): Promise<ContactContent> {
  try {
    return (await contactLoaders[locale]()).default;
  } catch {
    return (await contactLoaders[defaultLocale]()).default;
  }
}

/**
 * Generic namespace loader factory for the remaining page dictionaries. Each is
 * a folder of `<locale>.json` files with an English fallback. CMS-driven content
 * (blog posts, docs, changelog entries, FAQ items, partners) is NOT translated
 * here — only the static page chrome and browser UI strings.
 */
function makeLoader<T>(
  loaders: Record<Locale, () => Promise<{ default: T }>>,
) {
  return async (locale: Locale): Promise<T> => {
    try {
      return (await loaders[locale]()).default;
    } catch {
      return (await loaders[defaultLocale]()).default;
    }
  };
}

// --- privacy --------------------------------------------------------------
import type privacyEn from "@/messages/privacy/en.json";
export type PrivacyContent = typeof privacyEn;
export const getPrivacyContent = makeLoader<PrivacyContent>({
  en: () => import("@/messages/privacy/en.json"),
  de: () => import("@/messages/privacy/de.json"),
  fr: () => import("@/messages/privacy/fr.json"),
  es: () => import("@/messages/privacy/es.json"),
  it: () => import("@/messages/privacy/it.json"),
  ja: () => import("@/messages/privacy/ja.json"),
  zh: () => import("@/messages/privacy/zh.json"),
});

// --- docs -----------------------------------------------------------------
import type docsEn from "@/messages/docs/en.json";
export type DocsContent = typeof docsEn;
export const getDocsContent = makeLoader<DocsContent>({
  en: () => import("@/messages/docs/en.json"),
  de: () => import("@/messages/docs/de.json"),
  fr: () => import("@/messages/docs/fr.json"),
  es: () => import("@/messages/docs/es.json"),
  it: () => import("@/messages/docs/it.json"),
  ja: () => import("@/messages/docs/ja.json"),
  zh: () => import("@/messages/docs/zh.json"),
});

// --- blog -----------------------------------------------------------------
import type blogEn from "@/messages/blog/en.json";
export type BlogContent = typeof blogEn;
export const getBlogContent = makeLoader<BlogContent>({
  en: () => import("@/messages/blog/en.json"),
  de: () => import("@/messages/blog/de.json"),
  fr: () => import("@/messages/blog/fr.json"),
  es: () => import("@/messages/blog/es.json"),
  it: () => import("@/messages/blog/it.json"),
  ja: () => import("@/messages/blog/ja.json"),
  zh: () => import("@/messages/blog/zh.json"),
});

// --- changelog ------------------------------------------------------------
import type changelogEn from "@/messages/changelog/en.json";
export type ChangelogContent = typeof changelogEn;
export const getChangelogContent = makeLoader<ChangelogContent>({
  en: () => import("@/messages/changelog/en.json"),
  de: () => import("@/messages/changelog/de.json"),
  fr: () => import("@/messages/changelog/fr.json"),
  es: () => import("@/messages/changelog/es.json"),
  it: () => import("@/messages/changelog/it.json"),
  ja: () => import("@/messages/changelog/ja.json"),
  zh: () => import("@/messages/changelog/zh.json"),
});

// --- faq -------------------------------------------------------------------
import type faqEn from "@/messages/faq/en.json";
export type FaqContent = typeof faqEn;
export const getFaqContent = makeLoader<FaqContent>({
  en: () => import("@/messages/faq/en.json"),
  de: () => import("@/messages/faq/de.json"),
  fr: () => import("@/messages/faq/fr.json"),
  es: () => import("@/messages/faq/es.json"),
  it: () => import("@/messages/faq/it.json"),
  ja: () => import("@/messages/faq/ja.json"),
  zh: () => import("@/messages/faq/zh.json"),
});

// --- home -----------------------------------------------------------------
import type homeEn from "@/messages/home/en.json";
export type HomeContent = typeof homeEn;
export const getHomeContent = makeLoader<HomeContent>({
  en: () => import("@/messages/home/en.json"),
  de: () => import("@/messages/home/de.json"),
  fr: () => import("@/messages/home/fr.json"),
  es: () => import("@/messages/home/es.json"),
  it: () => import("@/messages/home/it.json"),
  ja: () => import("@/messages/home/ja.json"),
  zh: () => import("@/messages/home/zh.json"),
});

// --- partner --------------------------------------------------------------
import type partnerEn from "@/messages/partner/en.json";
export type PartnerContent = typeof partnerEn;
export const getPartnerContent = makeLoader<PartnerContent>({
  en: () => import("@/messages/partner/en.json"),
  de: () => import("@/messages/partner/de.json"),
  fr: () => import("@/messages/partner/fr.json"),
  es: () => import("@/messages/partner/es.json"),
  it: () => import("@/messages/partner/it.json"),
  ja: () => import("@/messages/partner/ja.json"),
  zh: () => import("@/messages/partner/zh.json"),
});
