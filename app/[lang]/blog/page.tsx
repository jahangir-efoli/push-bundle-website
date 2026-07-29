import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getBlogContent } from "@/i18n/content";
import { BlogListing } from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getBlogContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/blog",
    locale,
  });
}

/** Blog index (docs/PLAN.md §5.7a). */
export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, result, all, categories] = await Promise.all([
    getBlogContent(locale),
    cms.listPosts({ locale, page: 1 }),
    cms.listPosts({ locale, perPage: 100 }),
    cms.listCategories({ locale }),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <BlogListing
        eyebrow={content.eyebrow}
        title={content.title}
        intro={content.intro}
        result={result}
        allPosts={all.items}
        categories={categories}
        basePath="/blog"
        ui={content.ui}
      />
    </>
  );
}
