import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getChangelogContent, getCommon } from "@/i18n/content";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { ChangelogTimeline } from "@/components/changelog/changelog-timeline";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getChangelogContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/changelog",
    locale,
  });
}

/** Changelog (docs/PLAN.md §5.9). */
export default async function ChangelogPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, common, entries] = await Promise.all([
    getChangelogContent(locale),
    getCommon(locale),
    cms.listChangelog({ locale }),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Changelog", path: "/changelog" },
        ])}
      />

      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
      />

      <Container className="pb-16 pt-8">
        <ChangelogTimeline entries={entries} ui={content.ui} />
      </Container>

      <TrialCta content={common.trialCta} />
    </>
  );
}
