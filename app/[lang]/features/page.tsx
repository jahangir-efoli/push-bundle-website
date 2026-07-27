import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { AnimateIn } from "@/components/motion/animate-in";
import { buttonStyles } from "@/components/ui/button";
import { FeatureShowcase } from "@/components/sections/feature-showcase";
import { Reviews } from "@/components/sections/reviews";
import { TrialCta } from "@/components/sections/trial-cta";
import { FaqSection } from "@/components/sections/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import {
  featuresCopy,
  featureCategories,
  featureSpotlights,
} from "@/lib/content/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    title: "Features — The Complete Shopify Bundle Toolkit",
    description:
      "Explore every PushBundle feature: mix & match build-a-box, fixed and volume bundles, B2B pricing, live previews, native checkout, and more — all no-code.",
    path: "/features",
    locale: lang as Locale,
  });
}

/** Green check used in the spotlight capability lists. */
function Check() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-subtle text-primary"
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Features page (docs/PLAN.md §5 — new page). */
export default async function FeaturesPage() {
  const locale = DEFAULT_LOCALE;
  const [rating, reviews, faqs] = await Promise.all([
    cms.getAggregateRating(),
    cms.listReviews({ locale, limit: 12 }),
    cms.listFaqs({ locale, limit: 4 }),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />

      <PageHero
        eyebrow={featuresCopy.eyebrow}
        title={featuresCopy.title}
        subtitle={featuresCopy.subtitle}
      >
        <div className="flex flex-wrap gap-4">
          <a
            href={site.shopifyAppUrl}
            className={buttonStyles({ variant: "gradient", size: "lg" })}
          >
            Install Free on Shopify
          </a>
          <Link
            href="/pricing"
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            See pricing
          </Link>
        </div>
      </PageHero>

      {/* Feature catalogue */}
      <Section tone="wash">
        <div className="max-w-2xl">
          <Eyebrow>{featureCategories.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md text-balance">
            {featureCategories.title}
          </h2>
          <p className="mt-4 text-lg text-muted">
            {featureCategories.subtitle}
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCategories.items.map((item, i) => (
            <li key={item.title} className="h-full">
              <AnimateIn delay={(i % 3) * 0.08} className="h-full">
                <Card className="flex h-full flex-col">
                  <IconTile name={item.icon as IconName} />
                  <CardTitle as="h3" className="mt-5 text-lg">
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <ul className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-md bg-primary-subtle px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </Card>
              </AnimateIn>
            </li>
          ))}
        </ul>
      </Section>

      {/* Interactive demos — the five bundle types, live */}
      <FeatureShowcase />

      {/* Spotlights — alternating text + checklist panel */}
      {featureSpotlights.map((s, i) => (
        <Section key={s.title} tone={i % 2 === 1 ? "alt" : "default"}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h2 className="mt-3 text-display-md text-balance">{s.title}</h2>
              <p className="mt-4 text-lg text-muted">{s.body}</p>
              <div className="mt-8">
                <Link
                  href="/pricing"
                  className={buttonStyles({ variant: "secondary" })}
                >
                  See plans
                </Link>
              </div>
            </div>

            <div className={cn(i % 2 === 1 && "lg:order-1")}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-soft">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "radial-gradient(30rem 16rem at 100% 0%, color-mix(in oklab, var(--pb-cyan-400) 14%, transparent), transparent 60%), radial-gradient(28rem 16rem at 0% 100%, color-mix(in oklab, var(--pb-blue-500) 14%, transparent), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <IconTile name={s.icon as IconName} />
                  <ul className="mt-6 space-y-4">
                    {s.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <Check />
                        <span className="text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>
      ))}

      {/* Free plan nudge */}
      <Section tone="subtle" className="text-center">
        <Badge tone="brand">Free plan available</Badge>
        <h2 className="mx-auto mt-4 max-w-2xl text-display-md text-balance">
          Start bundling free — upgrade only when you grow
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Launch your first bundle on the free plan, then unlock Mix &amp; Match,
          B2B targeting, and advanced discounts on {site.name} when you&rsquo;re
          ready.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={site.shopifyAppUrl}
            className={buttonStyles({ variant: "gradient", size: "lg" })}
          >
            Install Free on Shopify
          </a>
          <Link
            href="/pricing"
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            Compare plans
          </Link>
        </div>
      </Section>

      <Reviews reviews={reviews} rating={rating} />
      <TrialCta />
      <FaqSection items={faqs} tone="subtle" />
    </>
  );
}
