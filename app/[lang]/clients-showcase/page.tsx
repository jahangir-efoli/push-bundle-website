import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, localizePath, type Locale } from "@/i18n/config";
import { getClientShowcaseContent, getCommon } from "@/i18n/content";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { IconTile } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { ClientGrid } from "@/components/client-showcase/client-grid";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { SITE_URL } from "@/lib/seo/site";
import { installUrl } from "@/lib/site-config";
import type { ClientStory } from "@/lib/cms";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getClientShowcaseContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/clients-showcase",
    locale,
  });
}

function collectionLd(clients: ClientStory[], locale: Locale, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: clients.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: `${SITE_URL}${localizePath(`/clients-showcase/${c.slug}`, locale)}`,
      })),
    },
  };
}

/** Client showcase — CMS-driven case studies, translatable (cms.md "Clients"). */
export default async function ClientShowcasePage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, common, result] = await Promise.all([
    getClientShowcaseContent(locale),
    getCommon(locale),
    cms.listClients({ locale, perPage: 100 }),
  ]);
  const clients = result.items;
  const { ui } = content;

  return (
    <>
      {clients.length > 0 && <JsonLd data={collectionLd(clients, locale, content.title)} />}
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Client showcase", path: "/clients-showcase" },
        ])}
      />

      <PageHero eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />

      <Container className="py-16">
        {clients.length > 0 ? (
          <ClientGrid
            clients={clients.map(({ slug, name, excerpt, logo }) => ({ slug, name, excerpt, logo }))}
            ui={ui}
          />
        ) : (
          // No stories published yet — an honest empty state, never demo clients.
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
            <IconTile name="sparkles" className="mx-auto" />
            <h2 className="mt-6 font-display text-display-sm text-balance">{ui.emptyTitle}</h2>
            <p className="mt-3 text-pretty text-muted">{ui.emptyBody}</p>
            <a
              href={installUrl("clients-showcase-empty")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "gradient", className: "mt-8" })}
            >
              {ui.emptyCta}
              <span className="sr-only"> {ui.opensNewTab}</span>
            </a>
          </div>
        )}
      </Container>

      <TrialCta content={common.trialCta} />
    </>
  );
}
