import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { cms } from "@/lib/cms";
import { getDocsContent } from "@/i18n/content";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { DocsBrowser } from "@/components/docs/docs-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getDocsContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/docs",
    locale,
  });
}

/** Docs home (docs/PLAN.md §5.8a). */
export default async function DocsPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, docs] = await Promise.all([
    getDocsContent(locale),
    cms.listDocs({ locale }),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Docs", path: "/docs" }])} />

      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        subtitle={content.subtitle}
      />

      <Container className="py-16">
        <DocsBrowser docs={docs} ui={content.ui} />

        <div className="mt-16 rounded-2xl border border-border bg-surface-subtle p-8 text-center">
          <p className="font-display text-lg font-bold">{content.help.title}</p>
          <p className="mt-2 text-muted">{content.help.body}</p>
          <Link
            href="/contact-us"
            className="group mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary"
          >
            {content.help.cta}
            <Icon
              name="arrow-right"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </>
  );
}
