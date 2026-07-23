import type { Metadata } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { PartnerGrid } from "@/components/partner/partner-grid";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "Partners — Shopify Bundle App Ecosystem",
  description:
    "The Shopify apps and services we partner with to deliver powerful, scalable bundling solutions.",
  path: "/partner",
    locale: lang as Locale,
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
export default async function PartnerPage() {
  const partners = await cms.listPartners({ locale: DEFAULT_LOCALE });

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
        eyebrow="Explore our partners"
        title="Our Partners"
        subtitle="We love working with the best in the Shopify ecosystem. By partnering with leading apps and services, we deliver powerful, scalable bundling solutions that keep your store ahead as you grow."
      />

      <Container className="py-16">
        <PartnerGrid partners={partners} />

        {/* Become a partner (light prompt, not a full program — §5.6) */}
        <div className="mt-16 rounded-2xl bg-brand-gradient p-8 text-center text-white sm:p-12">
          <h2 className="text-display-sm">Want to partner with us?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Building something for the Shopify ecosystem? We&rsquo;d love to hear
            from you.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-white px-6 font-semibold text-(--pb-indigo-700) transition-colors hover:bg-white/90"
          >
            Get in touch
          </a>
        </div>
      </Container>

      <TrialCta />
    </>
  );
}
