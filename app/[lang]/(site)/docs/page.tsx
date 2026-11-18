import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { cms } from "@/lib/cms";
import { getDocsContent } from "@/i18n/content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { DocsSearch } from "@/components/docs/docs-search";
import { DocRow } from "@/components/docs/doc-row";
import { TopicCard } from "@/components/docs/topic-card";
import { DocsHelp } from "@/components/docs/docs-help";
import { FaqSection } from "@/components/sections/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { groupDocs, popularDocs, quickStart } from "@/lib/docs/topics";
import { searchDocs, type DocIndexEntry } from "@/lib/docs/search";
import { cn, fmt } from "@/lib/utils";

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

/** A help-centre band — tighter rhythm than `Section`, so the stack scans. */
function Block({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="py-10 lg:py-14">
      <Container>{children}</Container>
    </section>
  );
}

/** One quick-start row whatever the step count (literal classes for Tailwind). */
const QUICK_COLS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/** Pick the singular/plural template for `n` and fill it in. */
const plural = (n: number, one: string, other: string) =>
  fmt(n === 1 ? one : other, { n });

/** Help-centre home (docs/PLAN.md §5.8a). */
export default async function DocsPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, docs, faqs] = await Promise.all([
    getDocsContent(locale),
    cms.listDocs({ locale }),
    cms.listFaqs({ locale, limit: 6 }),
  ]);
  const { hero, stats, topics: topicsCopy } = content;

  const topics = groupDocs(docs);
  const index: DocIndexEntry[] = docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    categoryName: d.categoryName,
  }));
  const steps = quickStart(docs);
  const popular = popularDocs(
    docs,
    steps.map((s) => s.doc.slug),
  );
  // Only suggest searches that find something today.
  const chips = content.search.chips.filter((c) => searchDocs(index, c).length > 0);
  // CJK headlines join without a space.
  const join = locale === "ja" || locale === "zh" ? "" : " ";

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: content.root, path: "/docs" },
        ])}
      />

      {/* z-10 keeps the search suggestions above the sections below. */}
      <section className="relative isolate z-10 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: [
              "radial-gradient(48rem 26rem at 8% -30%, rgba(47,107,255,.18), transparent 60%)",
              "radial-gradient(40rem 24rem at 94% -20%, rgba(58,217,238,.14), transparent 60%)",
            ].join(","),
          }}
        />
        <Container className="pb-6 pt-16 lg:pt-24">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="mx-auto mt-3 max-w-[20ch] text-display-xl text-balance">
            {hero.title}
            {join}
            <span className="text-brand-gradient">{hero.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{hero.subtitle}</p>
          <div className="mx-auto mt-8 max-w-2xl">
            <DocsSearch
              docs={index}
              ui={content.search}
              chips={{ label: content.search.popular, items: chips }}
            />
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted">
            <li>
              <b className="text-base text-foreground">{docs.length}</b>{" "}
              {docs.length === 1 ? stats.guideOne : stats.guideOther}
            </li>
            <li>
              <b className="text-base text-foreground">{topics.length}</b>{" "}
              {topics.length === 1 ? stats.topicOne : stats.topicOther}
            </li>
            <li>
              <b className="text-base text-foreground">24/7</b>{" "}
              {stats.support}
            </li>
          </ul>
        </Container>
      </section>

      {steps.length > 0 && (
        <Block>
          <Eyebrow>{content.quickStart.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md text-balance">
            {plural(steps.length, content.quickStart.titleOne, content.quickStart.titleOther)}
          </h2>
          <ol className={cn("mt-8 grid gap-4 sm:grid-cols-2", QUICK_COLS[steps.length])}>
            {steps.map(({ doc, step }, i) => (
              <li key={doc.slug}>
                <Link
                  href={`/docs/${doc.slug}`}
                  className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient font-bold text-white shadow-soft">
                    {i + 1}
                  </span>
                  <Icon
                    name="arrow-right"
                    className="absolute right-5 top-6 size-4 text-muted transition-[transform,color] group-hover:translate-x-1 group-hover:text-primary"
                  />
                  <span className="mt-4 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {doc.title}
                  </span>
                  <span className="mt-1.5 text-sm text-muted">
                    {content.quickStart.steps[step]}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Block>
      )}

      <Block id="topics">
        <Eyebrow>{topicsCopy.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-display-md text-balance">{topicsCopy.title}</h2>
        <p className="mt-3 text-muted">{topicsCopy.subtitle}</p>
        <div
          className={cn(
            "mt-8 grid gap-4 md:grid-cols-2",
            topics.length > 2 && "lg:grid-cols-3",
          )}
        >
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              description={
                topic.description ??
                topicsCopy.descriptions[topic.slug as keyof typeof topicsCopy.descriptions]
              }
              countLabel={plural(topic.docs.length, topicsCopy.guideOne, topicsCopy.guideOther)}
              viewAll={topicsCopy.viewAll}
            />
          ))}
        </div>
      </Block>

      {popular.length >= 3 && (
        <Block>
          <Eyebrow>{content.popular.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md text-balance">{content.popular.title}</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {popular.map((doc) => (
              <li key={doc.slug}>
                <DocRow doc={doc} topic={doc.categoryName} minRead={content.article.minRead} />
              </li>
            ))}
          </ul>
        </Block>
      )}

      <FaqSection items={faqs} eyebrow={content.faq.eyebrow} title={content.faq.title} />

      <Container className="pb-section">
        <DocsHelp content={content.help} />
      </Container>
    </>
  );
}
