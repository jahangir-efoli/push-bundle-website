/**
 * CMS content models (docs/PLAN.md §7).
 *
 * These types are the contract between pages and the CMS. Pages import ONLY
 * from here and `lib/cms` — never from a specific adapter — so the real API
 * can replace the fixtures without touching a single page.
 */

export type Locale = "en" | "de" | "fr" | "es" | "it" | "ja" | "zh";

/** Per-item SEO overrides; pages fall back to generated values (§7). */
export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
};

export type Person = {
  name: string;
  role?: string;
  avatar?: string;
  /** Short author bio for the "About the author" block. */
  bio?: string;
};

export type Category = {
  slug: string;
  name: string;
  /** Number of posts in this category, for archive pages. */
  count?: number;
};

/** Blog post (docs/PLAN.md §5.7). */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** Rich text/HTML from the CMS. */
  body: string;
  coverImage?: string;
  category: string;
  tags: string[];
  /** E-E-A-T: posts carry both an author and a reviewer. */
  author: Person;
  reviewedBy?: Person;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  locale: Locale;
  seo?: Seo;
};

/** Documentation article (docs/PLAN.md §5.8). */
export type DocArticle = {
  slug: string;
  title: string;
  body: string;
  /** Category slug; grouped on the docs home. */
  category: string;
  categoryName: string;
  /** Sort order within its category. */
  order: number;
  updatedAt: string;
  locale: Locale;
  seo?: Seo;
};

/** FAQ entry (docs/PLAN.md §5.5). Single source for /faq and all teasers. */
export type FaqItem = {
  slug: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  locale: Locale;
  /** True while the live answer is still placeholder copy (§9 #3). */
  needsRealAnswer?: boolean;
};

export type ChangelogCategory =
  | "New Feature"
  | "Improved"
  | "Fixed"
  | "Recognition"
  | "Launch";

/** Changelog entry (docs/PLAN.md §5.9). */
export type ChangelogEntry = {
  slug: string;
  title: string;
  body: string;
  category: ChangelogCategory;
  date: string;
  image?: string;
  locale: Locale;
};

/** Ecosystem partner (docs/PLAN.md §5.6). */
export type Partner = {
  slug: string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  locale: Locale;
};

/** Merchant review (docs/PLAN.md §5.1). Powers Review/AggregateRating JSON-LD. */
export type Review = {
  slug: string;
  author: string;
  /** Store or company name. */
  store?: string;
  country?: string;
  rating: number;
  quote: string;
  source?: "Shopify App Store" | "Direct";
  date?: string;
  locale: Locale;
};

export type AggregateRating = {
  score: number;
  count: number;
};

/** Paginated list result (docs/PLAN.md §5.7 blog pagination). */
export type Paginated<T> = {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

/** Minimal shape the sitemap needs from every collection (§4.3). */
export type ContentRef = {
  path: string;
  updatedAt: string;
};
