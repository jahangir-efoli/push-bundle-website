import type { Metadata } from "next";
import Image from "next/image";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getAboutContent, getCommon } from "@/i18n/content";
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

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getAboutContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/about-us",
    locale,
  });
}

/** About us page (docs/PLAN.md §5.3). */
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);

  const [content, common, rating, reviews, faqs] = await Promise.all([
    getAboutContent(locale),
    getCommon(locale),
    cms.getAggregateRating(),
    cms.listReviews({ locale, limit: 12 }),
    cms.listFaqs({ locale, limit: 4 }),
  ]);

  const { hero, whoWeAre, mission, vision, features, company } = content;

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
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
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
          <div className="rounded-2xl bg-gradient-border p-1.5 shadow-lift">
            <div className="relative aspect-16/10 overflow-hidden rounded-[0.9rem] bg-surface-subtle">
              <Image
                src="/images/about/who-we-are.png"
                alt={whoWeAre.title}
                fill
                quality={95}
                sizes="(min-width: 1024px) 42rem, 92vw"
                className="object-cover"
              />
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
          <Eyebrow>{features.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md text-balance">
            {features.title}
          </h2>
          <p className="mt-4 text-lg text-muted">{features.subtitle}</p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item, i) => (
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
