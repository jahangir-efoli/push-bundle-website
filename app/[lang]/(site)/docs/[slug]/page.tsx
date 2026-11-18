import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { DocEmbed } from "@/components/docs/doc-embed";
import { DocFeedback } from "@/components/docs/doc-feedback";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { localeAlternates, socialCard } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import { isLocale, type Locale } from "@/i18n/config";
import { getDocsContent } from "@/i18n/content";
import { enhanceDocBody } from "@/lib/docs/body";
import { cn, fmt, formatShortDate } from "@/lib/utils";
import type { DocArticle } from "@/lib/cms";

type Props = { params: Promise<{ lang: string; slug: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const doc = await cms.getDoc({ locale, slug });
  if (!doc) return {};
  // Advertise hreflang only for the locales this doc is really translated in
  // (always including English). Docs are English-only today, so this yields just
  // the English URL — a localized doc canonicals back to English — but the moment
  // the CMS translates a doc, its localized URL auto-flows into hreflang here.
  const availableLocales = await cms.getDocLocales({ slug: doc.slug });
  const alternates = localeAlternates(`/docs/${doc.slug}`, locale, availableLocales);
  const title = doc.seo?.metaTitle ?? `${doc.title} | PushBundle Docs`;
  const description =
    doc.seo?.metaDescription ??
    doc.excerpt ??
    `How to ${doc.title.toLowerCase()} with PushBundle.`;
  return {
    title,
    description,
    alternates,
    ...socialCard(alternates.canonical, title, description),
  };
}

function techArticleLd(doc: DocArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    ...(doc.excerpt && { description: doc.excerpt }),
    dateModified: doc.updatedAt,
    url: `${SITE_URL}/docs/${doc.slug}`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Help-centre article (docs/PLAN.md §5.8b). `params` is async (Next 16). */
export default async function DocArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);

  const [doc, docs, content] = await Promise.all([
    cms.getDoc({ locale, slug }),
    cms.listDocs({ locale }),
    getDocsContent(locale),
  ]);
  if (!doc) notFound();
  const t = content.article;

  // Topic, siblings and prev/next come from the ordered list, so they match
  // the topic page's order even if the single-doc response lacks a category.
  const listed = docs.find((d) => d.slug === doc.slug);
  const topicSlug = listed?.category ?? doc.category;
  const topicName = listed?.categoryName ?? doc.categoryName;
  const siblings = docs.filter((d) => d.category === topicSlug);
  const idx = siblings.findIndex((d) => d.slug === doc.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const body = enhanceDocBody(doc.body);
  const minutes = doc.readingTimeMinutes ?? listed?.readingTimeMinutes;
  const meta: Array<{ icon: "clock" | "steps" | "calendar"; text: string }> = [];
  if (minutes) meta.push({ icon: "clock", text: fmt(t.minRead, { n: minutes }) });
  if (body.steps)
    meta.push({
      icon: "steps",
      text: fmt(body.steps === 1 ? t.stepOne : t.stepOther, { n: body.steps }),
    });
  if (doc.updatedAt)
    meta.push({
      icon: "calendar",
      text: fmt(t.updated, { date: formatShortDate(doc.updatedAt, locale) }),
    });

  return (
    <>
      <JsonLd data={techArticleLd(doc)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: content.root, path: "/docs" },
          { name: topicName, path: `/docs/category/${topicSlug}` },
          { name: doc.title, path: `/docs/${doc.slug}` },
        ])}
      />

      <Container className="pb-section pt-10">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/docs" className="hover:text-primary hover:underline">
                {content.root}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link
                href={`/docs/category/${topicSlug}`}
                className="hover:text-primary hover:underline"
              >
                {topicName}
              </Link>
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
          <article className="min-w-0">
            <h1 className="text-display-md text-balance">{doc.title}</h1>
            {meta.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {meta.map((m) => (
                  <li key={m.icon} className="inline-flex items-center gap-1.5">
                    <Icon name={m.icon} className="size-4" />
                    {m.text}
                  </li>
                ))}
              </ul>
            )}

            {doc.embed && (
              <div className="mt-8">
                <DocEmbed embed={doc.embed} title={`${t.video}: ${doc.title}`} />
              </div>
            )}

            <div
              className="prose-pb doc-body mt-8 max-w-184"
              dangerouslySetInnerHTML={{ __html: body.html }}
            />

            <div className="mt-10 max-w-184">
              <DocFeedback slug={doc.slug} content={t.feedback} />
            </div>

            {(prev || next) && (
              <nav
                aria-label={`${t.previous} / ${t.next}`}
                className="mt-6 grid max-w-184 gap-3 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/docs/${prev.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-soft transition-colors hover:border-primary/40"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      ← {t.previous}
                    </span>
                    <span className="mt-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" className="hidden sm:block" />
                )}
                {next && (
                  <Link
                    href={`/docs/${next.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-surface p-4 text-right shadow-soft transition-colors hover:border-primary/40 sm:items-end"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {t.next} →
                    </span>
                    <span className="mt-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside className="grid content-start gap-4 lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label={fmt(t.inTopic, { topic: topicName })}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                {fmt(t.inTopic, { topic: topicName })}
              </p>
              <ul
                data-lenis-prevent
                className="-mr-2 mt-3 max-h-[46vh] overflow-y-auto pr-2"
              >
                {siblings.map((d) => {
                  const on = d.slug === doc.slug;
                  return (
                    <li key={d.slug} className="border-t border-border first:border-t-0">
                      <Link
                        href={`/docs/${d.slug}`}
                        aria-current={on ? "page" : undefined}
                        className={cn(
                          "block py-2 text-sm leading-snug transition-colors",
                          on ? "font-semibold text-foreground" : "text-muted hover:text-foreground",
                        )}
                      >
                        {d.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                {t.helpTitle}
              </p>
              <p className="mt-3 text-sm text-muted">{t.helpBody}</p>
              <Link
                href="/contact-us"
                className={buttonStyles({ variant: "gradient", size: "sm", className: "mt-4 w-full" })}
              >
                <Icon name="chat" className="size-4" />
                {t.helpCta}
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
