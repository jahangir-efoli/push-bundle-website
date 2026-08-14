import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { cms } from "@/lib/cms";
import { getPreviewPost } from "@/lib/cms/preview";
import { Container } from "@/components/ui/container";
import { PostCard, formatDate } from "@/components/blog/post-card";
import { MediaHolder } from "@/components/media/media-holder";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { blogPostingLd } from "@/lib/seo/article-data";
import { localeAlternates } from "@/lib/seo/metadata";
import { processArticle } from "@/lib/blog/toc";
import { REVIEW_DISCLOSURE } from "@/lib/blog/review";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { cn } from "@/lib/utils";
import type { Person } from "@/lib/cms";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; slug: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const { isEnabled: isPreview } = await draftMode();
  const post = isPreview
    ? await getPreviewPost(slug, locale)
    : await cms.getPost({ locale, slug });
  if (!post) return {};

  // A real per-locale translation self-canonicalizes; an English fallback served
  // under a localized URL points its canonical back to the English original so
  // it isn't indexed as a duplicate.
  const alternates = localeAlternates(`/blog/${post.slug}`, locale);
  if (locale !== defaultLocale && post.isTranslated === false) {
    alternates.canonical = `${SITE_URL}/blog/${post.slug}`;
  }

  // A page that defines its own `openGraph` does NOT inherit the root card, so
  // og:image + og:url must be set explicitly or the share preview is incomplete.
  // Prefer the post's own cover/OG image; fall back to the site card.
  const ogImage = post.seo?.ogImage ?? post.coverImage ?? OG_IMAGE;

  return {
    title: post.seo?.metaTitle ?? `${post.title} | PushBundle Blog`,
    description: post.seo?.metaDescription ?? post.excerpt,
    // Draft previews must never be indexed (docs/cmd.md).
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates,
    openGraph: {
      type: "article",
      url: alternates.canonical,
      siteName: SITE_NAME,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

/** Author avatar — photo when set, initials otherwise. */
function Avatar({
  person,
  size = "md",
}: {
  person: Person;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "size-14 text-base" : "size-11 text-sm";
  if (person.avatar) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={person.avatar}
        alt={person.name}
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-white/20",
          box,
        )}
        loading="lazy"
      />
    );
  }
  const initials = person.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-brand-gradient font-bold text-white",
        box,
      )}
    >
      {initials || "•"}
    </span>
  );
}

/** Single blog post (docs/PLAN.md §5.7c). `params` is async (Next 16). */
export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);

  // In draft preview, fetch the unpublished draft with the preview token.
  const { isEnabled: isPreview } = await draftMode();
  const post = isPreview
    ? await getPreviewPost(slug, locale)
    : await cms.getPost({ locale, slug });
  if (!post) notFound();

  const [related, categories] = await Promise.all([
    cms.listRelatedPosts({ locale, slug, limit: 3 }),
    cms.listCategories({ locale }),
  ]);

  const categoryName =
    categories.find((c) => c.slug === post.category)?.name ?? post.category;
  const updated = post.updatedAt !== post.publishedAt;

  // Lift the CMS's inline TOC into a sidebar (auto-built from headings when the
  // post has none) and get the body with guaranteed heading anchors.
  const { html, toc } = processArticle(post.body);

  return (
    <>
      {isPreview && (
        <div className="bg-warm px-gutter py-2.5 text-center text-sm font-semibold text-white">
          Preview mode — showing unpublished content.{" "}
          {/* Full navigation to the route handler (clears draft mode); not a page. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/preview/exit" className="underline underline-offset-2">
            Exit preview
          </a>
        </div>
      )}

      <JsonLd data={blogPostingLd(post)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <article>
        {/* Hero band — dark in both themes, with a brand aurora glow. */}
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
            <nav
              aria-label="Breadcrumb"
              className="text-sm text-inverse-foreground/60"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-inverse-foreground hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="line-clamp-1 text-inverse-foreground/80">
                  {post.title}
                </li>
              </ol>
            </nav>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Link
                href={`/blog/category/${post.category}`}
                className="rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/10"
              >
                {categoryName}
              </Link>
              <span className="text-sm text-inverse-foreground/65">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {updated && <> · updated {formatDate(post.updatedAt)}</>} ·{" "}
                {post.readingMinutes} min read
              </span>
            </div>

            <h1 className="mt-5 text-display-lg text-balance">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-5 max-w-4xl text-lg text-pretty text-inverse-foreground/80">
                {post.excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar person={post.author} />
                <div>
                  <p className="text-sm font-semibold">{post.author.name}</p>
                  {post.reviewedBy && (
                    <p className="text-xs text-inverse-foreground/60">
                      Reviewed by {post.reviewedBy.name}
                    </p>
                  )}
                </div>
              </div>
              <ShareButtons path={`/blog/${post.slug}`} title={post.title} />
            </div>
          </Container>
        </header>

        {/* Cover — pulled up to overlap the hero for a layered, premium feel. */}
        <Container className="relative z-10">
          <div className="-mt-8 overflow-hidden rounded-2xl shadow-lift ring-1 ring-border lg:-mt-14">
            <MediaHolder
              src={post.coverImage}
              alt={post.title}
              ratio="aspect-[16/8]"
              icon="layers"
            />
          </div>
        </Container>

        {/* Body + sticky TOC */}
        <Container className="py-12 lg:py-16">
          {toc.length > 0 ? (
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
              <aside className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto pr-2">
                  <TableOfContents items={toc} />
                </div>
              </aside>
              <div className="min-w-0">
                {/* Mobile TOC (collapsible) */}
                <details className="mb-8 rounded-xl border border-border bg-surface p-4 lg:hidden">
                  <summary className="text-sm font-semibold">
                    Table of contents
                  </summary>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {toc.map((i) => (
                      <li key={i.id} className={i.level === 3 ? "pl-4" : ""}>
                        <a
                          href={`#${i.id}`}
                          className="text-muted transition-colors hover:text-primary"
                        >
                          {i.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
                <div
                  className="prose-pb max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </div>
          ) : (
            <div
              className="prose-pb mx-auto max-w-3xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </Container>

        {/* Editorial review disclosure — trust / E-E-A-T signal, mirrored in the
            BlogPosting `reviewedBy` structured data. */}
        <Container className="pb-8">
          <div className="rounded-2xl border border-primary/20 bg-primary-subtle/50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3 4 6v6c0 5 3.4 7.6 8 9 4.6-1.4 8-4 8-9V6l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Reviewed for accuracy
                </p>
                <p className="mt-2 text-pretty text-muted">
                  {REVIEW_DISCLOSURE}
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* About the author */}
        <Container className="pb-12 lg:pb-16">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              About the author
            </p>
            <div className="mt-4 flex items-start gap-4">
              <Avatar person={post.author} size="lg" />
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-foreground">
                  {post.author.name}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {post.author.role ?? `${SITE_NAME} Contributor`}
                </p>
                {post.author.bio && (
                  <p className="mt-3 max-w-2xl text-muted">{post.author.bio}</p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface-subtle">
          <Container className="py-16">
            <h2 className="text-display-sm">Related articles</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="h-full">
                  <PostCard post={r} categories={categories} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <TrialCta />
    </>
  );
}
