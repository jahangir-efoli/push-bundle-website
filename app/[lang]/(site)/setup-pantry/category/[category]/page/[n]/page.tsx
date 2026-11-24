import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cms } from "@/lib/cms";
import { getRecipeContent } from "@/i18n/content";
import { BlogListing } from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { localeAlternates, socialCard } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { RECIPES_PATH } from "@/lib/site-config";

type Props = { params: Promise<{ lang: string; category: string; n: string }> };

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

async function getCategory(slug: string, locale: Locale) {
  const categories = await cms.listRecipeCategories({ locale });
  return categories.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, n } = await params;
  const locale = toLocale(lang);
  const found = await getCategory(category, locale);
  if (!found) return {};
  // Page 2+ self-canonicalize (never point back to page 1) per the SEO playbook.
  const alternates = localeAlternates(
    `${RECIPES_PATH}/category/${category}/page/${n}`,
    locale,
  );
  const title = `${found.name} — Page ${n} | PushBundle Setup Pantry`;
  const description = `PushBundle — ${found.name}, page ${n}.`;
  return {
    title,
    description,
    alternates,
    ...socialCard(alternates.canonical, title, description),
  };
}

/** Numbered Setup Pantry category pagination — mirrors the blog category
 *  pagination route. `params` is async (Next 16). */
export default async function SetupPantryCategoryPaginatedPage({ params }: Props) {
  const { lang, category, n } = await params;
  const page = Number(n);

  // Page 1 is the bare category URL — redirect to keep one canonical URL.
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect(`${RECIPES_PATH}/category/${category}`);

  const locale = toLocale(lang);
  const [content, found, categories] = await Promise.all([
    getRecipeContent(locale),
    getCategory(category, locale),
    cms.listRecipeCategories({ locale }),
  ]);
  if (!found) notFound();

  const [result, all] = await Promise.all([
    cms.listRecipes({ locale, page, category }),
    cms.listRecipes({ locale, perPage: 100, category }),
  ]);

  // Out-of-range page (e.g. /page/999) → a real 404, not duplicate content. The
  // CMS clamps an over-large page to the last one (non-empty items), so guard on
  // totalPages too, not just an empty list.
  if (result.items.length === 0 || page > result.totalPages) notFound();

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
