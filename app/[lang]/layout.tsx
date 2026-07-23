import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import "../globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeScript } from "@/components/layout/theme-script";
import { SkipLink } from "@/components/layout/skip-link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { LiveChat } from "@/components/integrations/live-chat";
import { JsonLd } from "@/components/seo/json-ld";
import { rootGraph } from "@/lib/seo/root-graph";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales, localeMeta, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Single Latin type family (docs/PLAN.md §6) — Plus Jakarta Sans for display +
 * body. CJK families (§8) are loaded only for the ja/zh locales.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const notoJP = Noto_Sans_JP({
  variable: "--font-cjk",
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});
const notoSC = Noto_Sans_SC({
  variable: "--font-cjk",
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const ROOT_DESCRIPTION =
  "Boost your AOV with mix & match bundles, volume discounts, and B2B bundle tools for Shopify. Free plan available.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PushBundle — Boost AOV with the Best Shopify Bundle App",
    template: `%s | ${SITE_NAME}`,
  },
  description: ROOT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "PushBundle — The Best Shopify Bundle App",
    description: ROOT_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PushBundle — The Best Shopify Bundle App",
    description: ROOT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

/** Pre-render every locale variant. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const dict = await getDictionary(locale);
  const cjk = locale === "ja" ? notoJP : locale === "zh" ? notoSC : null;

  return (
    // suppressHydrationWarning: ThemeScript sets the theme class pre-hydration.
    <html
      lang={localeMeta[locale].hreflang}
      suppressHydrationWarning
      className={cn("h-full antialiased", jakarta.variable, cjk?.variable)}
    >
      <head>
        <ThemeScript />
        <JsonLd data={rootGraph()} />
      </head>
      <body className={cn("flex min-h-full flex-col", cjk && "font-cjk")}>
        <SmoothScroll>
          <SkipLink label={dict.common.skipToContent} />
          <Header locale={locale} dict={dict} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
          <CookieConsent />
          <LiveChat />
        </SmoothScroll>
      </body>
    </html>
  );
}
