import type { Metadata } from "next";
import { Suspense } from "react";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cms } from "@/lib/cms";
import { isLocale, type Locale } from "@/i18n/config";
import { getDocsContent } from "@/i18n/content";
import { Container } from "@/components/ui/container";
import { DocsSearch } from "@/components/docs/docs-search";
import { DocsSearchResults } from "@/components/docs/docs-search-results";
import { DocsHelp } from "@/components/docs/docs-help";
import type { DocIndexEntry } from "@/lib/docs/search";

type Props = { params: Promise<{ lang: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { results } = await getDocsContent(toLocale(lang));
  // Result pages are thin, query-driven duplicates — keep them out of the index.
  return { title: results.metaTitle, robots: { index: false, follow: true } };
}

/** Help-centre search results (docs/PLAN.md §5.8a). */
export default async function DocsSearchPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, docs] = await Promise.all([
    getDocsContent(locale),
    cms.listDocs({ locale }),
  ]);
  const index: DocIndexEntry[] = docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    categoryName: d.categoryName,
    readingTimeMinutes: d.readingTimeMinutes,
  }));

  return (
    <Container className="pb-section pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/docs" className="hover:text-primary hover:underline">
              {content.root}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-foreground">
            {content.results.crumb}
          </li>
        </ol>
      </nav>

      <div className="mt-6 max-w-3xl">
        <h1 className="text-display-md">{content.results.metaTitle}</h1>
        <div className="relative z-10 mt-6">
          <Suspense
            fallback={<DocsSearch docs={index} ui={content.search} size="md" />}
          >
            <DocsSearchResults
              docs={index}
              content={{
                search: content.search,
                results: content.results,
                article: content.article,
              }}
            />
          </Suspense>
        </div>
      </div>

      <div className="mt-16">
        <DocsHelp content={content.help} />
      </div>
    </Container>
  );
}
