import { SiteTop } from "@/components/layout/site-top";
import { Footer } from "@/components/layout/footer";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

/**
 * Chrome for every normal page: promo bar + header, <main>, footer.
 *
 * It lives in this route group (not the root `[lang]/layout.tsx`) so CMS landing
 * pages — `(landing)/[slug]`, outside this group — can switch the header and
 * footer off. Route groups don't change URLs.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // The root layout already 404s an unknown locale; this only narrows the type.
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = await getDictionary(locale);

  return (
    <>
      <SiteTop locale={locale} dict={dict} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
