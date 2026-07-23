import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { Container } from "@/components/ui/container";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { localeAlternates } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { site } from "@/lib/site-config";

type Props = { params: Promise<{ lang: string; slug: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const doc = await cms.getDoc({ locale, slug });
  if (!doc) return {};
  return {
    title: `${doc.title} | PushBundle Docs`,
    description: `How to ${doc.title.toLowerCase()} with PushBundle.`,
    alternates: localeAlternates(`/docs/${doc.slug}`, locale),
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
        <div className="grid gap-12 lg:grid-cols-[16rem_1fr]">
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
