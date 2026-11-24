import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { getRecipeContent } from "@/i18n/content";
import { BlogListing } from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { localeAlternates, socialCard } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { RECIPES_PATH } from "@/lib/site-config";

type Props = { params: Promise<{ lang: string; category: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

async function getCategory(slug: string, locale: Locale) {
  const categories = await cms.listRecipeCategories({ locale });
  return categories.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  const locale = toLocale(lang);
  const found = await getCategory(category, locale);
  if (!found) return {};
  const alternates = localeAlternates(`${RECIPES_PATH}/category/${category}`, locale);
  const title = `${found.name} | PushBundle Setup Pantry`;
  const description = `PushBundle — ${found.name}.`;
  return {
    title,
    description,
    alternates,
    ...socialCard(alternates.canonical, title, description),
  };
}

/** Setup Pantry category archive — mirrors /blog/category/[category]. */
export default async function SetupPantryCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  const locale = toLocale(lang);

  const [content, found, categories] = await Promise.all([
    getRecipeContent(locale),
    getCategory(category, locale),
    cms.listRecipeCategories({ locale }),
  ]);
  if (!found) notFound();

  const [result, all] = await Promise.all([
    cms.listRecipes({ locale, page: 1, category }),
    cms.listRecipes({ locale, perPage: 100, category }),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Setup Pantry", path: RECIPES_PATH },
          { name: found.name, path: `${RECIPES_PATH}/category/${category}` },
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
        basePath={`${RECIPES_PATH}/category/${category}`}
        sectionPath={RECIPES_PATH}
        ui={content.ui}
      />
    </>
  );
}
