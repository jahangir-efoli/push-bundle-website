import type { Metadata } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { Hero } from "@/components/sections/hero";
import { FeatureTrio } from "@/components/sections/feature-trio";
import { BiggerOrders } from "@/components/sections/bigger-orders";
import { StorefrontPersonalization } from "@/components/sections/storefront-personalization";
import { MobileExperience } from "@/components/sections/mobile-experience";
import { ComingSoon } from "@/components/sections/coming-soon";
import { Reviews } from "@/components/sections/reviews";
import { BlogTeaser } from "@/components/sections/blog-teaser";
import { TrialCta } from "@/components/sections/trial-cta";
import { FaqTeaser } from "@/components/sections/faq-teaser";
import { JsonLd } from "@/components/seo/json-ld";
import {
  faqPageLd,
  organizationLd,
  softwareApplicationLd,
} from "@/lib/seo/structured-data";
import { hero } from "@/lib/content/home";

export const metadata: Metadata = {
  title: "PushBundle — Boost Your AOV with the Best Shopify Bundle App",
  description: hero.subtitle,
};

/**
 * Home page (docs/PLAN.md §5.1).
 * Server Component: content is fetched from the CMS adapter and the whole page
 * renders as HTML. Only the scroll reveals and accordion ship client JS.
 */
export default async function Home() {
  const locale = DEFAULT_LOCALE;

  const [latestPosts, categories, faqItems, reviews, rating] = await Promise.all([
    cms.listPosts({ locale, perPage: 3 }),
    cms.listCategories({ locale }),
    cms.listFaqs({ locale, limit: 5 }),
    cms.listReviews({ locale, limit: 12 }),
    cms.getAggregateRating(),
  ]);

  return (
    <>
      <JsonLd data={organizationLd()} />
      <JsonLd data={softwareApplicationLd({ rating, reviews })} />
      <JsonLd data={faqPageLd(faqItems)} />

      <Hero rating={rating} />
      <FeatureTrio />
      <BiggerOrders />
      <StorefrontPersonalization />
      <MobileExperience />
      <ComingSoon />
      <Reviews reviews={reviews} rating={rating} />
      <BlogTeaser posts={latestPosts.items} categories={categories} />
      <TrialCta />
      <FaqTeaser items={faqItems} />
    </>
  );
}
