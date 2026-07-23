import type { Metadata } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { BlogListing } from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "Blog — Shopify Bundling Tips & Best Practices",
  description:
    "Bundling strategies, AOV-boosting tips, and the latest e-commerce trends to help Shopify merchants scale.",
  path: "/blog",
    locale: lang as Locale,
  });
}

const INTRO =
  "We're committed to empowering Shopify merchants with actionable insights. Dive into our expert-curated articles filled with bundling strategies, AOV-boosting tips, and the latest e-commerce trends.";

/** Blog index (docs/PLAN.md §5.7a). */
export default async function BlogPage() {
  const locale = DEFAULT_LOCALE;
  const [result, all, categories] = await Promise.all([
    cms.listPosts({ locale, page: 1 }),
    cms.listPosts({ locale, perPage: 100 }),
    cms.listCategories({ locale }),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <BlogListing
        title="Articles"
        intro={INTRO}
        result={result}
        allPosts={all.items}
        categories={categories}
        basePath="/blog"
      />
    </>
  );
}
