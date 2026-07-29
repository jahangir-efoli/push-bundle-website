import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getCommon, getPricingContent } from "@/i18n/content";
import { plans, comparison } from "@/lib/content/pricing";
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

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getPricingContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/pricing",
    locale,
  });
}

/** Pricing page (docs/PLAN.md §5.2). */
export default async function PricingPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);

  const [content, common, rating, reviews, faqs] = await Promise.all([
    getPricingContent(locale),
    getCommon(locale),
    cms.getAggregateRating(),
    cms.listReviews({ locale, limit: 12 }),
    cms.listFaqs({ locale, category: "billing-plans" }),
  ]);

  // Prices/flags stay in code (single source of truth); merge the localized
  // text on top, by index. The JSON arrays mirror `lib/content/pricing.ts`.
  const displayPlans = plans.map((plan, i) => ({
    ...plan,
    tagline: content.plans[i]?.tagline ?? plan.tagline,
    cta: content.plans[i]?.cta ?? plan.cta,
    trial: content.plans[i]?.trial || plan.trial,
    features: content.plans[i]?.features ?? plan.features,
  }));

  const displayComparison = comparison.map((group, i) => ({
    group: content.comparison.groups[i]?.group ?? group.group,
    rows: group.rows.map((row, j) => ({
      ...row,
      label: content.comparison.groups[i]?.rows[j]?.label ?? row.label,
    })),
  }));

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
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <Section>
        <PricingPlans plans={displayPlans} billing={content.billing} />
      </Section>

      <PricingComparison
        comparison={displayComparison}
        headers={{
          title: content.comparison.title,
          feature: content.comparison.featureHeader,
          starter: content.comparison.starterHeader,
          growth: content.comparison.growthHeader,
        }}
      />
      <TrustBand rating={rating} content={content.trust} />

      <FaqSection
        items={faqs}
        eyebrow={content.faq.eyebrow}
        title={content.faq.title}
      />

      <TrialCta content={common.trialCta} />
    </>
  );
}
