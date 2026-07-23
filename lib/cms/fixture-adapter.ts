import type { CmsAdapter, ListPostsParams } from "./adapter";
import type {
  Category,
  ChangelogEntry,
  ContentRef,
  DocArticle,
  FaqItem,
  Locale,
  Paginated,
  Partner,
  Post,
  Review,
} from "./types";
import { categories, posts } from "./fixtures/posts";
import {
  aggregateRating,
  changelog,
  docs,
  faqCategories,
  faqs,
  partners,
  reviews,
} from "./fixtures/content";

/**
 * Fixture-backed CMS (docs/PLAN.md §7, Phase 3).
 *
 * Stands in for the client's CMS so every page can be built and tested before
 * the API exists. Fixtures are English-only; requests for other locales fall
 * back to English, exactly as the real adapter must (§8 fallback rule).
 *
 * Methods are async on purpose — pages must already await, so swapping in the
 * HTTP adapter changes nothing at the call sites.
 */

export const DEFAULT_PER_PAGE = 10;

/** Localized content is not in the fixtures yet — always serve English. */
function withLocale<T extends { locale: Locale }>(items: T[], locale: Locale): T[] {
  // Real adapter: request `locale`, fall back to `en` when a translation is
  // missing. Here every fixture is `en`, so we relabel to keep pages honest
  // about which locale they rendered.
  return locale === "en" ? items : items.map((item) => ({ ...item, locale }));
}

function paginate<T>(items: T[], page: number, perPage: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    perPage,
    total,
    totalPages,
  };
}

const byNewest = <T extends { publishedAt?: string; date?: string }>(a: T, b: T) =>
  (b.publishedAt ?? b.date ?? "").localeCompare(a.publishedAt ?? a.date ?? "");

export const fixtureAdapter: CmsAdapter = {
  // ---- Blog -------------------------------------------------------------
  async listPosts({
    locale,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    category,
  }: ListPostsParams): Promise<Paginated<Post>> {
    const filtered = posts
      .filter((p) => !category || p.category === category)
      .slice()
      .sort(byNewest);

    return paginate(withLocale(filtered, locale), page, perPage);
  },

  async getPost({ locale, slug }) {
    const post = posts.find((p) => p.slug === slug);
    return post ? withLocale([post], locale)[0] : null;
  },

  async listRelatedPosts({ locale, slug, limit = 3 }) {
    const current = posts.find((p) => p.slug === slug);
    if (!current) return [];

    const related = posts
      .filter((p) => p.slug !== slug && p.category === current.category)
      .sort(byNewest);

    // Top up with recent posts if the category is thin, so the slot is never empty.
    const filler = posts
      .filter((p) => p.slug !== slug && !related.includes(p))
      .sort(byNewest);

    return withLocale([...related, ...filler].slice(0, limit), locale);
  },

  async listCategories({ locale }): Promise<Category[]> {
    void locale;
    return categories.map((c) => ({
      ...c,
      count: posts.filter((p) => p.category === c.slug).length,
    }));
  },

  // ---- Docs -------------------------------------------------------------
  async listDocs({ locale }): Promise<DocArticle[]> {
    const sorted = docs
      .slice()
      .sort((a, b) =>
        a.category === b.category
          ? a.order - b.order
          : a.category.localeCompare(b.category),
      );
    return withLocale(sorted, locale);
  },

  async getDoc({ locale, slug }) {
    const doc = docs.find((d) => d.slug === slug);
    return doc ? withLocale([doc], locale)[0] : null;
  },

  // ---- FAQ --------------------------------------------------------------
  async listFaqs({ locale, category, limit }): Promise<FaqItem[]> {
    const filtered = faqs
      .filter((f) => !category || f.category === category)
      .slice()
      .sort((a, b) => a.order - b.order);

    return withLocale(limit ? filtered.slice(0, limit) : filtered, locale);
  },

  async listFaqCategories({ locale }) {
    void locale;
    return faqCategories;
  },

  // ---- Changelog --------------------------------------------------------
  async listChangelog({ locale }): Promise<ChangelogEntry[]> {
    return withLocale(changelog.slice().sort(byNewest), locale);
  },

  // ---- Partners ---------------------------------------------------------
  async listPartners({ locale }): Promise<Partner[]> {
    return withLocale(partners, locale);
  },

  // ---- Reviews ----------------------------------------------------------
  async listReviews({ locale, limit }): Promise<Review[]> {
    return withLocale(limit ? reviews.slice(0, limit) : reviews, locale);
  },

  async getAggregateRating() {
    return aggregateRating;
  },

  // ---- Sitemap ----------------------------------------------------------
  async listAllContentRefs({ locale }): Promise<ContentRef[]> {
    void locale;
    const refs: ContentRef[] = [
      ...posts.map((p) => ({ path: `/blog/${p.slug}`, updatedAt: p.updatedAt })),
      ...categories.map((c) => ({
        path: `/blog/category/${c.slug}`,
        updatedAt: posts[0]?.updatedAt ?? "",
      })),
      ...docs.map((d) => ({ path: `/docs/${d.slug}`, updatedAt: d.updatedAt })),
    ];
    return refs;
  },
};
