import type {
  AggregateRating,
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

/**
 * The CMS contract (docs/PLAN.md §7).
 *
 * Phase 3 ships a fixture-backed implementation. Phase 9 adds an HTTP
 * implementation of this same interface against the client's CMS — pages keep
 * working untouched because they only ever depend on this shape.
 *
 * Every method takes a `locale`: dynamic content arrives already-localized from
 * the CMS (§8), and implementations must fall back to English when a locale is
 * missing so pages never render empty.
 */

export type ListPostsParams = {
  locale: Locale;
  page?: number;
  perPage?: number;
  /** Category slug filter, for /blog/category/[category]. */
  category?: string;
};

export interface CmsAdapter {
  // ---- Blog -------------------------------------------------------------
  listPosts(params: ListPostsParams): Promise<Paginated<Post>>;
  getPost(params: { locale: Locale; slug: string }): Promise<Post | null>;
  /**
   * Locales a post has a REAL translation in (always includes `en`). Drives
   * accurate blog hreflang/canonical so a fallback locale isn't advertised as its
   * own alternate. Cheap at scale: the per-locale list fetches it reads are shared
   * across every post via Next's data cache.
   */
  getPostLocales(params: { slug: string }): Promise<Locale[]>;
  listRelatedPosts(params: {
    locale: Locale;
    slug: string;
    limit?: number;
  }): Promise<Post[]>;
  listCategories(params: { locale: Locale }): Promise<Category[]>;

  // ---- Docs -------------------------------------------------------------
  listDocs(params: { locale: Locale }): Promise<DocArticle[]>;
  getDoc(params: { locale: Locale; slug: string }): Promise<DocArticle | null>;

  // ---- FAQ --------------------------------------------------------------
  /** `limit` powers the FAQ teasers on Home/Pricing/About/Contact. */
  listFaqs(params: {
    locale: Locale;
    category?: string;
    limit?: number;
  }): Promise<FaqItem[]>;
  /** FAQ categories (name + slug) for the /faq page grouping. */
  listFaqCategories(params: {
    locale: Locale;
  }): Promise<Array<{ slug: string; name: string }>>;

  // ---- Changelog --------------------------------------------------------
  listChangelog(params: { locale: Locale }): Promise<ChangelogEntry[]>;

  // ---- Partners ---------------------------------------------------------
  listPartners(params: { locale: Locale }): Promise<Partner[]>;

  // ---- Reviews ----------------------------------------------------------
  listReviews(params: { locale: Locale; limit?: number }): Promise<Review[]>;
  getAggregateRating(): Promise<AggregateRating>;

  // ---- Sitemap ----------------------------------------------------------
  /**
   * Every CMS-driven path with its lastmod, so `app/sitemap.ts` stays
   * self-updating without knowing about individual collections (§4.3).
   */
  listAllContentRefs(params: { locale: Locale }): Promise<ContentRef[]>;
}
