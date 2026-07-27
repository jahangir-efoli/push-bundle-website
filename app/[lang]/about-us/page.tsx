import type { Metadata } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { AnimateIn } from "@/components/motion/animate-in";
import { Reviews } from "@/components/sections/reviews";
import { TrialCta } from "@/components/sections/trial-cta";
import { FaqSection } from "@/components/sections/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, organizationLd } from "@/lib/seo/structured-data";
import {
  aboutCopy,
  aboutFeatures,
  company,
  mission,
  vision,
  whoWeAre,
} from "@/lib/content/about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "About — The Team Behind the Shopify Bundle App",
  description:
    "Why we built PushBundle, who it's for, and how WhenLab helps Shopify merchants unlock smarter, scalable bundling. Built in Dubai, made for global merchants.",
  path: "/about-us",
    locale: lang as Locale,
  });
}

/** About us page (docs/PLAN.md §5.3). */
export default async function AboutPage() {
  const locale = DEFAULT_LOCALE;
  const [rating, reviews, faqs] = await Promise.all([
    cms.getAggregateRating(),
    cms.listReviews({ locale, limit: 12 }),
    cms.listFaqs({ locale, limit: 4 }),
  ]);

  return (
    <>
      <JsonLd data={organizationLd()} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About us", path: "/about-us" },
        ])}
      />

      <PageHero
        eyebrow={aboutCopy.eyebrow}
        title={aboutCopy.title}
        subtitle={aboutCopy.subtitle}
      />

      {/* Who we are — heading + image (drop a photo at /images/about/who-we-are.*) */}
      <Section tone="wash">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>{whoWeAre.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-display-md text-balance">
              {whoWeAre.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {whoWeAre.body}
            </p>
          </div>
          <div className="rounded-2xl bg-brand-gradient p-1.5 shadow-lift">
            <div className="relative grid aspect-16/10 place-items-center overflow-hidden rounded-[0.9rem] bg-surface-subtle">
              <span className="flex flex-col items-center gap-2 text-sm text-muted">
                <svg viewBox="0 0 24 24" className="size-9 text-muted/50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20" />
                </svg>
                Who we are
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission + Vision */}
      <Section tone="alt">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
            <Eyebrow>{mission.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-display-sm">{mission.title}</h2>
            <p className="mt-4 text-muted">{mission.body}</p>
            <ul className="mt-6 space-y-3">
              {mission.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden="true" className="text-warm-foreground">
                    ✓
                  </span>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-brand-gradient p-8 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
              {vision.eyebrow}
            </p>
            <h2 className="mt-3 text-display-sm">{vision.title}</h2>
            <p className="mt-4 text-white/90">{vision.body}</p>
          </div>
        </div>
      </Section>

      {/* Feature grid */}
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>{aboutFeatures.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md text-balance">
            {aboutFeatures.title}
          </h2>
          <p className="mt-4 text-lg text-muted">{aboutFeatures.subtitle}</p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aboutFeatures.items.map((item, i) => (
            <li key={item.title} className="h-full">
              <AnimateIn delay={i * 0.06} className="h-full">
                <Card className="h-full">
                  <IconTile name={item.icon as IconName} />
                  <CardTitle className="mt-5 text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </Card>
              </AnimateIn>
            </li>
          ))}
        </ul>
      </Section>

      {/* Company / stats */}
      <Section tone="subtle">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <Eyebrow>{company.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-display-md text-balance">
              {company.title}
            </h2>
            <p className="mt-4 text-lg text-muted">{company.body}</p>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {company.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-2xl font-extrabold text-brand-gradient">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Reviews reviews={reviews} rating={rating} />
      <TrialCta />
      <FaqSection items={faqs} tone="subtle" />
    </>
  );
}
