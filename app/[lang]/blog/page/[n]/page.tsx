import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { BlogListing } from "@/components/blog/blog-listing";

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return {
    title: `Articles — Page ${n} | PushBundle Blog`,
    alternates: { canonical: `/blog/page/${n}` },
  };
}

/** Numbered blog pagination (docs/PLAN.md §5.7a). `params` is async (Next 16). */
export default async function BlogPaginatedPage({ params }: Props) {
  const { n } = await params;
  const page = Number(n);

  // Page 1 is /blog — redirect to keep one canonical URL.
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect("/blog");

  const locale = DEFAULT_LOCALE;
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
