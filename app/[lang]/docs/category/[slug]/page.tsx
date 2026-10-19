import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getDocsContent, type DocsContent } from "@/i18n/content";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { DocRow } from "@/components/docs/doc-row";
import { TopicsNav } from "@/components/docs/topics-nav";
import { DocsHelp } from "@/components/docs/docs-help";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { groupDocs, topicIcon, type DocTopic } from "@/lib/docs/topics";
import { fmt } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

async function load(lang: string, slug: string) {
  const locale = toLocale(lang);
  const [content, docs] = await Promise.all([
    getDocsContent(locale),
    cms.listDocs({ locale }),
  ]);
  const topics = groupDocs(docs);
  const topic = topics.find((t) => t.slug === slug);
  return { locale, content, topics, topic };
}

function describe(topic: DocTopic, content: DocsContent) {
  const d = content.topics.descriptions;
  return topic.description ?? d[topic.slug as keyof typeof d];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const { locale, content, topic } = await load(lang, slug);
  if (!topic) return {};
  return pageMetadata({
    title: `${topic.name} | PushBundle ${content.root}`,
    description: describe(topic, content) ?? content.meta.description,
    path: `/docs/category/${topic.slug}`,
    locale,
  });
}

/** A help-centre topic: every guide in one CMS category (docs/PLAN.md §5.8b). */
export default async function DocsTopicPage({ params }: Props) {
  const { lang, slug } = await params;
  const { content, topics, topic } = await load(lang, slug);
  if (!topic) notFound();

  const description = describe(topic, content);
  const count = fmt(
    topic.docs.length === 1 ? content.topics.guideOne : content.topics.guideOther,
    { n: topic.docs.length },
  );

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: content.root, path: "/docs" },
          { name: topic.name, path: `/docs/category/${topic.slug}` },
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
            <li aria-current="page" className="text-foreground">
              {topic.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
          <aside className="min-w-0">
            <TopicsNav topics={topics} current={topic.slug} label={content.topics.sidebar} />
          </aside>

          <div className="min-w-0">
            <header className="flex items-start gap-4">
              <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-primary-subtle text-primary">
                <Icon name={topicIcon(topic.slug)} className="size-6" />
              </span>
              <div>
                <h1 className="text-display-md text-balance">{topic.name}</h1>
                <p className="mt-1 text-muted">
                  {description ? `${description} · ${count}` : count}
                </p>
              </div>
            </header>

            <ol className="mt-8 grid gap-3">
              {topic.docs.map((doc, i) => (
                <li key={doc.slug}>
                  <DocRow doc={doc} number={i + 1} minRead={content.article.minRead} />
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16">
          <DocsHelp content={content.help} />
        </div>
      </Container>
    </>
  );
}
