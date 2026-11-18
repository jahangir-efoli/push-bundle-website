import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getCommon, getPartnerContent } from "@/i18n/content";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { PartnerGrid } from "@/components/partner/partner-grid";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getPartnerContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/partner",
    locale,
  });
}

function itemListLd(
  partners: { name: string; url: string; description: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PushBundle Partners",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: partners.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: p.url,
      })),
    },
  };
}

/** Partners (docs/PLAN.md §5.6) — CMS-driven. */
export default async function PartnerPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, common, partners] = await Promise.all([
    getPartnerContent(locale),
    getCommon(locale),
    cms.listPartners({ locale }),
  ]);

  return (
    <>
      <JsonLd data={itemListLd(partners)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Partners", path: "/partner" },
        ])}
      />

      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
      />

      <Container className="py-16">
        <PartnerGrid partners={partners} ui={content.ui} />

        {/* Become a partner — same banner geometry as the TrialCta below so the
            two CTA bands read as the same size (§5.6). */}
        <div className="mt-16 rounded-3xl bg-brand-gradient px-6 py-16 text-center text-white shadow-lift sm:px-12 sm:py-20">
          <h2 className="mx-auto max-w-3xl text-display-md text-balance">
            {content.becomePartner.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/95">
            {content.becomePartner.body}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-white px-6 font-semibold text-(--pb-indigo-700) transition-colors hover:bg-white/90"
          >
            {content.becomePartner.cta}
          </a>
        </div>
      </Container>

      <TrialCta content={common.trialCta} />
    </>
  );
}
