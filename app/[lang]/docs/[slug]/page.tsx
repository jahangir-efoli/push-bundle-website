import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { Container } from "@/components/ui/container";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { localeAlternates, socialCard } from "@/lib/seo/metadata";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/seo/site";
import { site } from "@/lib/site-config";

type Props = { params: Promise<{ lang: string; slug: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const doc = await cms.getDoc({ locale, slug });
  if (!doc) return {};
  const alternates = localeAlternates(`/docs/${doc.slug}`, locale);
  // An English fallback served under a localized URL points its canonical back to
  // the English original so it isn't indexed as a duplicate (mirrors the blog).
  if (locale !== defaultLocale && doc.isTranslated === false) {
    alternates.canonical = `${SITE_URL}/docs/${doc.slug}`;
  }
  const title = `${doc.title} | PushBundle Docs`;
  const description = `How to ${doc.title.toLowerCase()} with PushBundle.`;
  return {
    title,
    description,
    alternates,
    ...socialCard(alternates.canonical, title, description),
  };
}

function techArticleLd(title: string, slug: string, updatedAt: string) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    dateModified: updatedAt,
    url: `https://pushbundle.com/docs/${slug}`,
    publisher: { "@type": "Organization", name: site.name },
  };
}

/** Doc article (docs/PLAN.md §5.8b). `params` is async (Next 16). */
export default async function DocArticlePage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);

  const [doc, docs] = await Promise.all([
    cms.getDoc({ locale, slug }),
    cms.listDocs({ locale }),
  ]);
  if (!doc) notFound();

  // The single-doc response doesn't carry a reliable category, so read the
  // current doc's neighbours + siblings from the ordered list instead.
  const idx = docs.findIndex((d) => d.slug === doc.slug);
  const prev = idx > 0 ? docs[idx - 1] : null;
  const next = idx >= 0 && idx < docs.length - 1 ? docs[idx + 1] : null;
  const category = idx >= 0 ? docs[idx].category : doc.category;
  const related = docs
    .filter((d) => d.category === category && d.slug !== doc.slug)
    .slice(0, 4);

  return (
    <>
      <JsonLd data={techArticleLd(doc.title, doc.slug, doc.updatedAt)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: doc.categoryName, path: "/docs" },
          { name: doc.title, path: `/docs/${doc.slug}` },
        ])}
      />

      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <DocsSidebar docs={docs} currentSlug={doc.slug} />
          </aside>

          {/* Article */}
          <article>
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/docs" className="hover:text-primary hover:underline">
                    Docs
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>{doc.categoryName}</li>
              </ol>
            </nav>

            <h1 className="mt-4 text-display-md text-balance">{doc.title}</h1>

            <div
              className="prose-pb mt-8 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: doc.body }}
            />

            {/* Prev / next article navigation */}
            {(prev || next) && (
              <nav
                aria-label="Article navigation"
                className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/docs/${prev.slug}`}
                    className="group flex flex-col rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-surface-subtle"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      ← Previous
                    </span>
                    <span className="mt-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
                {next ? (
                  <Link
                    href={`/docs/${next.slug}`}
                    className="group flex flex-col rounded-xl border border-border p-4 text-right transition-colors hover:border-primary/50 hover:bg-surface-subtle sm:items-end"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Next →
                    </span>
                    <span className="mt-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
              </nav>
            )}

            {/* Related articles (same category) */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Related articles
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/docs/${r.slug}`}
                        className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-surface-subtle hover:text-primary"
                      >
                        <Icon
                          name="file-text"
                          className="size-4 shrink-0 text-primary"
                        />
                        <span className="min-w-0 flex-1 truncate">{r.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-12 rounded-2xl border border-border bg-surface-subtle p-6">
              <p className="font-semibold">Still stuck?</p>
              <Link
                href="/contact-us"
                className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
              >
                Contact support →
              </Link>
            </div>
          </article>
        </div>
      </Container>
    </>
  );
}
