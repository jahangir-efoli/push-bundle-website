import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { isLocale, type Locale } from "@/i18n/config";
import { getHomeContent, getCommon } from "@/i18n/content";
import { Hero } from "@/components/sections/hero";
import { FeatureShowcaseLive } from "@/components/sections/feature-showcase-live";
// Hidden on the home page (kept for easy re-enable):
// import { FeatureTrio } from "@/components/sections/feature-trio";
import { WhyPushbundle } from "@/components/sections/why-pushbundle";
// import { StorefrontPersonalization } from "@/components/sections/storefront-personalization";
import { MobileExperience } from "@/components/sections/mobile-experience";
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
import { hero, whyPushbundle, whyBeyond } from "@/lib/content/home";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export const metadata: Metadata = {
  title: "PushBundle — Boost Your AOV with the Best Shopify Bundle App",
  description: hero.subtitle,
};

/**
 * Home page (docs/PLAN.md §5.1).
 * Server Component: content is fetched from the CMS adapter and the whole page
 * renders as HTML. Only the scroll reveals and accordion ship client JS.
 *
 * Static copy is localized via `messages/home/<locale>.json`; images/icons stay
 * in `lib/content/home.ts` and are merged by index. CMS-driven content (posts,
 * reviews, FAQs) is fetched in the active locale by the adapter.
 */
export default async function Home({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);

  const [home, common, latestPosts, categories, faqItems, reviews, rating] =
    await Promise.all([
      getHomeContent(locale),
      getCommon(locale),
      cms.listPosts({ locale, perPage: 3 }),
      cms.listCategories({ locale }),
      cms.listFaqs({ locale, limit: 5 }),
      cms.listReviews({ locale, limit: 12 }),
      cms.getAggregateRating(),
    ]);

  // Merge translated why-section text with the image paths (kept in code).
  const whyContent = {
    ...home.why,
    items: home.why.items.map((it, i) => ({
      ...it,
      image: whyPushbundle.items[i]?.image ?? "",
    })),
  };
  const whyBeyondContent = {
    ...home.whyBeyond,
    items: home.whyBeyond.items.map((it, i) => ({
      ...it,
      image: whyBeyond.items[i]?.image ?? "",
    })),
  };

  return (
    <>
      <JsonLd data={organizationLd()} />
      <JsonLd data={softwareApplicationLd({ rating, reviews })} />
      <JsonLd data={faqPageLd(faqItems)} />

      <Hero rating={rating} content={home.hero} />
      <FeatureShowcaseLive />
      {/* <FeatureTrio /> — hidden per request */}
      <WhyPushbundle content={whyContent} />
      <WhyPushbundle content={whyBeyondContent} reverse tone="alt" />
      {/* <StorefrontPersonalization /> — hidden per request */}
      <MobileExperience content={home.mobile} />
      <Reviews
        reviews={reviews}
        rating={rating}
        eyebrow={common.reviews.eyebrow}
        title={common.reviews.title}
        subtitle={common.reviews.subtitle}
      />
      <BlogTeaser
        posts={latestPosts.items}
        categories={categories}
        content={home.blogTeaser}
      />
      <FaqTeaser items={faqItems} content={home.faqTeaser} />
      <TrialCta content={common.trialCta} />
    </>
  );
}
