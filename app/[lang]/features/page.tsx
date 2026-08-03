import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getCommon, getFeaturesContent } from "@/i18n/content";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { FeatureDemos } from "@/components/sections/feature-demos";
import { Reviews } from "@/components/sections/reviews";
import { TrialCta } from "@/components/sections/trial-cta";
import { FaqSection } from "@/components/sections/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { installUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getFeaturesContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/features",
    locale,
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
export default async function FeaturesPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);

  const [content, common, rating, reviews, faqs] = await Promise.all([
    getFeaturesContent(locale),
    getCommon(locale),
    cms.getAggregateRating(),
    cms.listReviews({ locale, limit: 12 }),
    cms.listFaqs({ locale, limit: 4 }),
  ]);

  const { hero, demos, spotlights, freePlan } = content;

  // One spotlight = text + checklist panel; layout alternates by index.
  const renderSpotlight = (
    s: (typeof spotlights.items)[number],
    i: number,
  ) => (
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
              {common.ctas.seePlans}
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
  );

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
      >
        <div className="flex flex-wrap gap-4">
          <a
            href={installUrl("features-hero")}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: "gradient", size: "lg" })}
          >
            {common.ctas.installFree}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link
            href="/pricing"
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            {common.ctas.seePricing}
          </Link>
        </div>
      </PageHero>

      {/* Mix & Match spotlight — the lead section (replaces the old toolkit). */}
      {spotlights.items.length > 0 && renderSpotlight(spotlights.items[0], 0)}

      {/* Each bundle type as its own section: live demo + copy, alternating */}
      <FeatureDemos features={demos.items} labels={common.demoLabels} />

      {/* Remaining spotlights — the lead one is shown above the demos. */}
      {spotlights.items.slice(1).map((s, i) => renderSpotlight(s, i + 1))}

      {/* Free plan nudge */}
      <Section tone="subtle" className="text-center">
        <Badge tone="brand">{freePlan.badge}</Badge>
        <h2 className="mx-auto mt-4 max-w-2xl text-display-md text-balance">
          {freePlan.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          {freePlan.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={installUrl("features-bottom")}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: "gradient", size: "lg" })}
          >
            {common.ctas.installFree}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link
            href="/pricing"
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            {common.ctas.comparePlans}
          </Link>
        </div>
      </Section>

      <Reviews
        reviews={reviews}
        rating={rating}
        eyebrow={common.reviews.eyebrow}
        title={common.reviews.title}
        subtitle={common.reviews.subtitle}
      />
      <TrialCta content={common.trialCta} />
      <FaqSection
        items={faqs}
        eyebrow={common.faq.eyebrow}
        title={common.faq.title}
        tone="subtle"
      />
    </>
  );
}
