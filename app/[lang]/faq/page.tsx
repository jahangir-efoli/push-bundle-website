import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { cms } from "@/lib/cms";
import { getCommon, getFaqContent } from "@/i18n/content";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, faqPageLd } from "@/lib/seo/structured-data";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getFaqContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/faq",
    locale,
  });
}

/** FAQ page (docs/PLAN.md §5.5) — NEW page, CMS-driven. */
export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, common, items, faqCategories] = await Promise.all([
    getFaqContent(locale),
    getCommon(locale),
    cms.listFaqs({ locale }),
    cms.listFaqCategories({ locale }),
  ]);

  return (
    <>
      {/* FAQPage JSON-LD is built from the FULL set — client search must not
          shrink the structured data (docs/PLAN.md §5.5). */}
      <JsonLd data={faqPageLd(items)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])} />

      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
      />

      <Container className="py-16">
        <FaqBrowser items={items} categories={faqCategories} ui={content.ui} />

        <div className="mt-16 rounded-2xl border border-border bg-surface-subtle p-8 text-center">
          <p className="font-display text-lg font-bold">{content.help.title}</p>
          <Link
            href="/contact-us"
            className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
          >
            {content.help.cta} →
          </Link>
        </div>
      </Container>

      <TrialCta content={common.trialCta} />
    </>
  );
}
