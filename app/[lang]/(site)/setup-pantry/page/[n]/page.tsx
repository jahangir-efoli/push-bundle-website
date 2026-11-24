import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cms } from "@/lib/cms";
import { getRecipeContent } from "@/i18n/content";
import { socialCard } from "@/lib/seo/metadata";
import { BlogListing } from "@/components/blog/blog-listing";
import { isLocale, type Locale } from "@/i18n/config";
import { RECIPES_PATH } from "@/lib/site-config";

type Props = { params: Promise<{ lang: string; n: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, n } = await params;
  const locale = toLocale(lang);
  const { pageTitleTemplate } = await getRecipeContent(locale);
  const canonical = `${RECIPES_PATH}/page/${n}`;
  const title = `${pageTitleTemplate.replace("{n}", n)} | PushBundle Setup Pantry`;
  return {
    title,
    alternates: { canonical },
    ...socialCard(canonical, title),
  };
}

/** Numbered Setup Pantry pagination — mirrors /blog/page/[n]. `params` is async (Next 16). */
export default async function SetupPantryPaginatedPage({ params }: Props) {
  const { lang, n } = await params;
  const page = Number(n);

  // Page 1 is the bare section URL — redirect to keep one canonical URL.
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect(RECIPES_PATH);

  const locale = toLocale(lang);
  const [content, result, all, categories] = await Promise.all([
    getRecipeContent(locale),
    cms.listRecipes({ locale, page }),
    cms.listRecipes({ locale, perPage: 100 }),
    cms.listRecipeCategories({ locale }),
  ]);

  if (result.items.length === 0) notFound();

  return (
    <BlogListing
      eyebrow={content.eyebrow}
      title={content.title}
      result={result}
      allPosts={all.items}
      categories={categories}
      basePath={RECIPES_PATH}
      sectionPath={RECIPES_PATH}
      ui={content.ui}
    />
  );
}
