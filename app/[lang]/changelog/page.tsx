import type { Metadata } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { ChangelogTimeline } from "@/components/changelog/changelog-timeline";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "Changelog — Shopify Bundle App Updates",
  description:
    "The latest PushBundle features, improvements, and fixes — see what's new in the Shopify bundle app.",
  path: "/changelog",
    locale: lang as Locale,
  });
}

/** Changelog (docs/PLAN.md §5.9). */
export default async function ChangelogPage() {
  const entries = await cms.listChangelog({ locale: DEFAULT_LOCALE });

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Changelog", path: "/changelog" },
        ])}
      />

      <PageHero
        eyebrow="Changelog"
        title="What's new in PushBundle"
        subtitle="New features, improvements, and fixes — shipped regularly."
      />

      <Container className="pb-16 pt-8">
        <ChangelogTimeline entries={entries} />
      </Container>

      <TrialCta />
    </>
  );
}
