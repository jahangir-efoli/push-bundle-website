import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { getBlogContent } from "@/i18n/content";
import { BlogListing } from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { localeAlternates } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; category: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

async function getCategory(slug: string, locale: Locale) {
  const categories = await cms.listCategories({ locale });
  return categories.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  const locale = toLocale(lang);
  const found = await getCategory(category, locale);
  if (!found) return {};
  return {
    title: `${found.name} | PushBundle Blog`,
    description: `PushBundle — ${found.name}.`,
    alternates: localeAlternates(`/blog/category/${category}`, locale),
  };
}

/** Blog category archive (docs/PLAN.md §5.7b). */
export default async function BlogCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  const locale = toLocale(lang);

  const [content, found, categories] = await Promise.all([
    getBlogContent(locale),
    getCategory(category, locale),
    cms.listCategories({ locale }),
  ]);
  if (!found) notFound();

  const [result, all] = await Promise.all([
    cms.listPosts({ locale, page: 1, category }),
    cms.listPosts({ locale, perPage: 100, category }),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: found.name, path: `/blog/category/${category}` },
        ])}
      />
      <BlogListing
        eyebrow={content.eyebrow}
        title={found.name}
        intro={`${content.categoryIntroPrefix} ${found.name}.`}
        result={result}
        allPosts={all.items}
        categories={categories}
        activeCategory={category}
        basePath={`/blog/category/${category}`}
        ui={content.ui}
      />
    </>
  );
}
