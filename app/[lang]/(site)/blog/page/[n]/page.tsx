import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cms } from "@/lib/cms";
import { getBlogContent } from "@/i18n/content";
import { socialCard } from "@/lib/seo/metadata";
import { BlogListing } from "@/components/blog/blog-listing";
import { isLocale, type Locale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; n: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, n } = await params;
  const locale = toLocale(lang);
  const { pageTitleTemplate } = await getBlogContent(locale);
  const canonical = `/blog/page/${n}`;
  const title = `${pageTitleTemplate.replace("{n}", n)} | PushBundle Blog`;
  return {
    title,
    alternates: { canonical },
    ...socialCard(canonical, title),
  };
}

/** Numbered blog pagination (docs/PLAN.md §5.7a). `params` is async (Next 16). */
export default async function BlogPaginatedPage({ params }: Props) {
  const { lang, n } = await params;
  const page = Number(n);

  // Page 1 is /blog — redirect to keep one canonical URL.
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect("/blog");

  const locale = toLocale(lang);
  const [content, result, all, categories] = await Promise.all([
    getBlogContent(locale),
    cms.listPosts({ locale, page }),
    cms.listPosts({ locale, perPage: 100 }),
    cms.listCategories({ locale }),
  ]);

  if (result.items.length === 0) notFound();

  return (
    <BlogListing
      eyebrow={content.eyebrow}
      title={content.title}
      result={result}
      allPosts={all.items}
      categories={categories}
      basePath="/blog"
      ui={content.ui}
    />
  );
}
