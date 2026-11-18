import { draftMode } from "next/headers";
import { SiteTop } from "@/components/layout/site-top";
import { Footer } from "@/components/layout/footer";
import { PreviewBanner } from "@/components/layout/preview-banner";
import { getLandingPage } from "@/lib/cms/landing";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

/**
 * Chrome for CMS landing pages (`/<slug>`). Outside the (site) group, so the
 * page's `showHeader` / `showFooter` switches decide whether this site's header
 * (with the promo bar) and footer render. The root layout still supplies the
 * <head>, fonts, global CSS and analytics.
 *
 * The decision lives in this layout — not the page — so an unknown slug's 404
 * (`not-found.tsx` here) still gets the normal, locale-aware header and footer:
 * `not-found` receives no params, but this layout does. `getLandingPage` is
 * request-deduped, so the page and metadata reuse this fetch.
 */
export default async function LandingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  // Landing pages are English; other locale prefixes render the same page
  // (canonical → the unprefixed URL) inside that locale's chrome.
  const locale: Locale = isLocale(lang) ? lang : "en";
  const [page, dict, draft] = await Promise.all([
    getLandingPage(slug),
    getDictionary(locale),
    draftMode(),
  ]);

  const showHeader = page ? page.showHeader : true;
  const showFooter = page ? page.showFooter : true;

  return (
    <>
      {draft.isEnabled && page && <PreviewBanner />}
      {showHeader && <SiteTop locale={locale} dict={dict} />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {showFooter && <Footer locale={locale} dict={dict} />}
    </>
  );
}
