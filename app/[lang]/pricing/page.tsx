import type { Metadata } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { PricingPlans } from "@/components/sections/pricing-plans";
import { PricingComparison } from "@/components/sections/pricing-comparison";
import { TrustBand } from "@/components/sections/trust-band";
import { FaqSection } from "@/components/sections/faq-section";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbLd,
  softwareApplicationLd,
} from "@/lib/seo/structured-data";
import { pricingCopy } from "@/lib/content/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "Pricing — Flexible Shopify Bundle Plans",
  description:
    "Simple, flexible pricing for the PushBundle Shopify bundle app. Start free forever, or unlock Mix & Match and advanced tools on Growth from $14/month.",
  path: "/pricing",
    locale: lang as Locale,
  });
}

/** Pricing page (docs/PLAN.md §5.2). */
export default async function PricingPage() {
  const locale = DEFAULT_LOCALE;
  const [rating, reviews, faqs] = await Promise.all([
    cms.getAggregateRating(),
    cms.listReviews({ locale, limit: 12 }),
    cms.listFaqs({ locale, category: "billing-plans" }),
  ]);

  return (
    <>
      <JsonLd data={softwareApplicationLd({ rating, reviews })} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />

      <PageHero
        eyebrow={pricingCopy.eyebrow}
        title={pricingCopy.title}
        subtitle={pricingCopy.subtitle}
      />

      <Section>
        <PricingPlans />
      </Section>

      <PricingComparison />
      <TrustBand rating={rating} />

      <FaqSection
        items={faqs}
        eyebrow={pricingCopy.faqEyebrow}
        title={pricingCopy.faqTitle}
      />

      <TrialCta />
    </>
  );
}
