import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, faqPageLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "FAQ — Shopify Bundle App Questions Answered",
  description:
    "Answers to common PushBundle questions — setting up bundles, discounts, billing, compatibility, and more.",
  path: "/faq",
    locale: lang as Locale,
  });
}

/** FAQ page (docs/PLAN.md §5.5) — NEW page, CMS-driven. */
export default async function FaqPage() {
  const [items, faqCategories] = await Promise.all([
    cms.listFaqs({ locale: DEFAULT_LOCALE }),
    cms.listFaqCategories({ locale: DEFAULT_LOCALE }),
  ]);

  return (
    <>
      {/* FAQPage JSON-LD is built from the FULL set — client search must not
          shrink the structured data (docs/PLAN.md §5.5). */}
      <JsonLd data={faqPageLd(items)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])} />

      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Get expert answers to all your PushBundle questions — from setting up custom bundles to maximizing discounts and seamless integrations."
      />

      <Container className="py-16">
        <FaqBrowser items={items} categories={faqCategories} />

        <div className="mt-16 rounded-2xl border border-border bg-surface-subtle p-8 text-center">
          <p className="font-display text-lg font-bold">
            Didn&rsquo;t find the answer you&rsquo;re looking for?
          </p>
          <Link
            href="/contact-us"
            className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
          >
            Contact our support →
          </Link>
        </div>
      </Container>

      <TrialCta />
    </>
  );
}
