import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cms } from "@/lib/cms";
import { Container } from "@/components/ui/container";
import { MediaHolder } from "@/components/media/media-holder";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonStyles } from "@/components/ui/button";
import { ClientCard, formatStoryDate } from "@/components/client-showcase/client-card";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { localeAlternates } from "@/lib/seo/metadata";
import { processArticle } from "@/lib/blog/toc";
import { getClientShowcaseContent, getCommon } from "@/i18n/content";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { isLocale, localeMeta, localizePath, type Locale } from "@/i18n/config";
import type { ClientStory } from "@/lib/cms";

type Props = { params: Promise<{ lang: string; slug: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const client = await cms.getClient({ locale, slug });
  if (!client) return {};

  // cms.md SEO rule: a real translation self-canonicalizes and joins hreflang;
  // an English fallback canonicals to the English URL and is left out.
  const availableLocales = await cms.getClientLocales({ slug: client.slug });
  const alternates = localeAlternates(`/clients-showcase/${client.slug}`, locale, availableLocales);
  const description = client.seo?.metaDescription ?? client.excerpt;
  const ogImage = client.seo?.ogImage ?? client.coverImage ?? OG_IMAGE;

  return {
    // A CMS meta title is final (don't append the brand twice); otherwise the
    // layout template adds " | PushBundle".
    title: client.seo?.metaTitle ? { absolute: client.seo.metaTitle } : client.title,
    description,
    alternates,
    robots: client.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url: alternates.canonical,
      siteName: SITE_NAME,
      title: client.title,
      description,
      publishedTime: client.publishedAt,
      modifiedTime: client.updatedAt,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: client.title,
      description,
      images: [ogImage],
    },
  };
}

function articleLd(client: ClientStory, locale: Locale) {
  const url = `${SITE_URL}${localizePath(`/clients-showcase/${client.slug}`, locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: client.title,
    description: client.excerpt,
    ...(client.coverImage ? { image: client.coverImage } : {}),
    datePublished: client.publishedAt,
    dateModified: client.updatedAt,
    inLanguage: localeMeta[locale].hreflang,
    mainEntityOfPage: url,
    author: client.author
      ? { "@type": "Person", name: client.author.name }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    about: {
      "@type": "Organization",
      name: client.name,
      ...(client.link ? { url: client.link } : {}),
    },
  };
}

/** One client story (cms.md "Clients" → `/clients/{slug}`). */
export default async function ClientStoryPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);

  const client = await cms.getClient({ locale, slug });
  if (!client) notFound();

  const [content, common, all] = await Promise.all([
    getClientShowcaseContent(locale),
    getCommon(locale),
    cms.listClients({ locale, perPage: 100 }),
  ]);
  const { ui } = content;
  const more = all.items.filter((c) => c.slug !== client.slug).slice(0, 3);
  const { html, toc } = processArticle(client.body);

  return (
    <>
      <JsonLd data={articleLd(client, locale)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Client showcase", path: "/clients-showcase" },
          { name: client.title, path: `/clients-showcase/${client.slug}` },
        ])}
      />

      <article>
        {/* Hero band — dark in both themes, brand aurora (matches blog posts). */}
        <header className="relative overflow-hidden bg-inverse text-inverse-foreground">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(42rem 26rem at 10% -12%, color-mix(in oklab, var(--pb-blue-500) 42%, transparent), transparent 60%), radial-gradient(38rem 24rem at 100% 0%, color-mix(in oklab, var(--pb-cyan-400) 26%, transparent), transparent 60%)",
            }}
          />
          <Container className="relative py-14 lg:py-20">
            <nav aria-label="Breadcrumb" className="text-sm text-inverse-foreground/60">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/clients-showcase"
                    className="transition-colors hover:text-inverse-foreground hover:underline"
                  >
                    {ui.breadcrumb}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="line-clamp-1 text-inverse-foreground/80">{client.name}</li>
              </ol>
            </nav>

            {/* Title only — logo, client name and excerpt are intentionally not
                shown here (the excerpt still feeds meta description / OG). */}
            <h1 className="mt-8 max-w-4xl text-display-lg text-balance">{client.title}</h1>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-inverse-foreground/65">
                <time dateTime={client.publishedAt}>
                  {formatStoryDate(client.publishedAt, locale)}
                </time>{" "}
                · {client.readingMinutes} {ui.minRead}
                {client.author && <> · {client.author.name}</>}
              </p>
              {client.link && (
                <a
                  href={client.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles({ variant: "inverseOutline", size: "sm" })}
                >
                  {ui.visitStore}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only"> {ui.opensNewTab}</span>
                </a>
              )}
            </div>
          </Container>
        </header>

        {client.coverImage && (
          <Container className="relative z-10">
            <div className="-mt-8 overflow-hidden rounded-2xl shadow-lift ring-1 ring-border lg:-mt-14">
              <MediaHolder
                src={client.coverImage}
                alt={client.coverImageAlt || client.title}
                ratio="aspect-[16/8]"
              />
            </div>
          </Container>
        )}

        {/* Body + sticky TOC (same treatment as blog posts). */}
        <Container className="py-12 lg:py-16">
          {toc.length > 0 ? (
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
              <aside className="hidden lg:block">
                {/* data-lenis-prevent: Lenis smooth-scroll otherwise swallows the
                    wheel here and scrolls the page, so a long TOC could not scroll. */}
                <div
                  data-lenis-prevent
                  className="scrollbar-brand sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
                >
                  <TableOfContents items={toc} label={ui.tableOfContents} />
                </div>
              </aside>
              <div className="min-w-0">
                <details className="mb-8 rounded-xl border border-border bg-surface p-4 lg:hidden">
                  <summary className="text-sm font-semibold">{ui.tableOfContents}</summary>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {toc.map((i) => (
                      <li key={i.id} className={i.level === 3 ? "pl-4" : ""}>
                        <a href={`#${i.id}`} className="text-muted transition-colors hover:text-primary">
                          {i.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
                <div className="prose-pb max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
          ) : (
            <div
              className="prose-pb mx-auto max-w-3xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </Container>
      </article>

      {more.length > 0 && (
        <section className="border-t border-border bg-surface-subtle">
          <Container className="py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-display-sm">{ui.moreStories}</h2>
              <Link
                href="/clients-showcase"
                className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
              >
                {ui.allStories} <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((c) => (
                <li key={c.slug} className="h-full min-w-0">
                  <ClientCard client={c} readMore={ui.readMore} titleAs="h3" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <TrialCta content={common.trialCta} />
    </>
  );
}
