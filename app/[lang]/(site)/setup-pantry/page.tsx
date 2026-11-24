import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getRecipeContent } from "@/i18n/content";
import { BlogListing } from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { RECIPES_PATH } from "@/lib/site-config";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getRecipeContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: RECIPES_PATH,
    locale,
  });
}

/** Setup Pantry index — Recipe Contents, laid out exactly like the blog index. */
export default async function SetupPantryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [content, result, all, categories] = await Promise.all([
    getRecipeContent(locale),
    cms.listRecipes({ locale, page: 1 }),
    cms.listRecipes({ locale, perPage: 100 }),
    cms.listRecipeCategories({ locale }),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Setup Pantry", path: RECIPES_PATH }])} />
      <BlogListing
        eyebrow={content.eyebrow}
        title={content.title}
        intro={content.intro}
        result={result}
        allPosts={all.items}
        categories={categories}
        basePath={RECIPES_PATH}
        sectionPath={RECIPES_PATH}
        ui={content.ui}
      />
    </>
  );
}
