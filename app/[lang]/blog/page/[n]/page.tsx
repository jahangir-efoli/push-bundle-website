import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cms } from "@/lib/cms";
import { BlogListing } from "@/components/blog/blog-listing";
import { isLocale, type Locale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; n: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return {
    title: `Articles — Page ${n} | PushBundle Blog`,
    alternates: { canonical: `/blog/page/${n}` },
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
  const [result, all, categories] = await Promise.all([
    cms.listPosts({ locale, page }),
    cms.listPosts({ locale, perPage: 100 }),
    cms.listCategories({ locale }),
  ]);

  if (result.items.length === 0) notFound();

  return (
    <BlogListing
      title="Articles"
      result={result}
      allPosts={all.items}
      categories={categories}
      basePath="/blog"
    />
  );
}
