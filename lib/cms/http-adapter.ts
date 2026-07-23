import type { CmsAdapter, ListPostsParams } from "./adapter";
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
import { cmsFetch } from "./http/client";
import {
  categoriesFromPosts,
  mapChangelog,
  mapDoc,
  mapDocs,
  mapFaqs,
  mapPartner,
  mapPost,
  mapReview,
} from "./http/mappers";
import { fixtureAdapter } from "./fixture-adapter";
import { site } from "@/lib/site-config";

/**
 * HTTP CMS adapter (docs/PLAN.md §7, Phase 9) — the efoli storefront API.
 *
 * Resilience (the brief + the nextjs-seo-website skill require it): every list
 * method falls back to the fixtures on error OR empty, so a CMS outage — or an
 * as-yet-unpopulated site — never yields an empty page or an empty sitemap.
 * Single-item lookups fall back to fixtures so demo slugs still resolve.
 *
 * The locale is passed straight to the API (`?locale=`), which returns
 * translated content where it exists and English otherwise (its own fallback).
 */

/** API `locale`: English is the base and takes no locale param. */
const apiLocale = (locale: Locale) => (locale === "en" ? undefined : locale);

// ---- API envelope reading -------------------------------------------------
const numeric = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

/**
 * Read a paginated list response tolerantly. The array may live under a named
 * key (`posts`, `data`, `items`, `results`, `docs`…) or be the bare top-level
 * array; pagination metadata may use `total`/`totalCount`/`count`,
 * `totalPages`/`pageCount`/`pages`, `page`/`currentPage`, `limit`/`perPage`/`pageSize`.
 * This keeps us on the LIVE data instead of silently falling back to fixtures
 * when a CMS deployment shapes its envelope differently.
 */
function readListEnvelope(
  raw: unknown,
  primaryKey: string,
): {
  items: unknown[];
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
} {
  if (Array.isArray(raw)) return { items: raw };
  const o = (raw ?? {}) as Record<string, unknown>;
  const items =
    (Array.isArray(o[primaryKey]) && (o[primaryKey] as unknown[])) ||
    (Array.isArray(o.data) && (o.data as unknown[])) ||
    (Array.isArray(o.items) && (o.items as unknown[])) ||
    (Array.isArray(o.results) && (o.results as unknown[])) ||
    (Array.isArray(o.docs) && (o.docs as unknown[])) ||
    [];
  return {
    items,
    total: numeric(o.total) ?? numeric(o.totalCount) ?? numeric(o.count),
    totalPages:
      numeric(o.totalPages) ?? numeric(o.pageCount) ?? numeric(o.pages),
    page: numeric(o.page) ?? numeric(o.currentPage),
    limit: numeric(o.limit) ?? numeric(o.perPage) ?? numeric(o.pageSize),
  };
}

export const httpAdapter: CmsAdapter = {
  // ---- Blog ---------------------------------------------------------------
  async listPosts({ locale, page = 1, perPage = 10, category }: ListPostsParams) {
    try {
      const raw = await cmsFetch<unknown>("/api/public/posts", {
        page,
        limit: perPage,
        category,
        locale: apiLocale(locale),
      });
      const { items: rawPosts, total, totalPages, page: gotPage, limit } =
        readListEnvelope(raw, "posts");
      if (!rawPosts.length) {
        return fixtureAdapter.listPosts({ locale, page, perPage, category });
      }
      const resolvedTotal = total ?? rawPosts.length;
      const resolvedPerPage = limit ?? perPage;
      return {
        items: rawPosts.map((p) => mapPost(p as Parameters<typeof mapPost>[0], locale)),
        page: gotPage ?? page,
        perPage: resolvedPerPage,
        total: resolvedTotal,
        // Derive totalPages when the CMS omits it, so pagination reflects the
        // real corpus size instead of collapsing to a single page.
        totalPages:
          totalPages ?? Math.max(1, Math.ceil(resolvedTotal / resolvedPerPage)),
      } satisfies Paginated<Post>;
    } catch {
      return fixtureAdapter.listPosts({ locale, page, perPage, category });
    }
  },

  async getPost({ locale, slug }) {
    try {
      const p = await cmsFetch<Parameters<typeof mapPost>[0]>(
        `/api/public/posts/${slug}`,
        { locale: apiLocale(locale) },
      );
      return mapPost(p, locale);
    } catch {
      // Not in the CMS → maybe a fixture demo slug.
      return fixtureAdapter.getPost({ locale, slug });
    }
  },

  async listRelatedPosts({ locale, slug, limit = 3 }) {
    try {
      const current = await this.getPost({ locale, slug });
      if (!current) return [];
      const { items } = await this.listPosts({
        locale,
        perPage: limit + 1,
        category: current.category,
      });
      const related = items.filter((p) => p.slug !== slug).slice(0, limit);
      return related.length ? related : fixtureAdapter.listRelatedPosts({ locale, slug, limit });
    } catch {
      return fixtureAdapter.listRelatedPosts({ locale, slug, limit });
    }
  },

  async listCategories({ locale }): Promise<Category[]> {
    try {
      const raw = await cmsFetch<unknown>("/api/public/posts", {
        limit: 100,
        locale: apiLocale(locale),
      });
      const { items } = readListEnvelope(raw, "posts");
      if (!items.length) return fixtureAdapter.listCategories({ locale });
      return categoriesFromPosts(items as Parameters<typeof categoriesFromPosts>[0]);
    } catch {
      return fixtureAdapter.listCategories({ locale });
    }
  },

  // ---- Docs ---------------------------------------------------------------
  async listDocs({ locale }): Promise<DocArticle[]> {
    try {
      const data = await cmsFetch<Parameters<typeof mapDocs>[0]>("/api/public/docs");
      const docs = mapDocs(data);
      return docs.length ? docs : fixtureAdapter.listDocs({ locale });
    } catch {
      return fixtureAdapter.listDocs({ locale });
    }
  },

  async getDoc({ locale, slug }) {
    try {
      const d = await cmsFetch<Parameters<typeof mapDoc>[0]>(`/api/public/docs/${slug}`);
      return mapDoc(d);
    } catch {
      return fixtureAdapter.getDoc({ locale, slug });
    }
  },

  // ---- FAQ ----------------------------------------------------------------
  async listFaqs({ locale, category, limit }): Promise<FaqItem[]> {
    try {
      const data = await cmsFetch<Parameters<typeof mapFaqs>[0]>("/api/public/faqs", { category });
      const { items } = mapFaqs(data);
      if (!items.length) return fixtureAdapter.listFaqs({ locale, category, limit });
      const filtered = category ? items.filter((f) => f.category === category) : items;
      return limit ? filtered.slice(0, limit) : filtered;
    } catch {
      return fixtureAdapter.listFaqs({ locale, category, limit });
    }
  },

  async listFaqCategories({ locale }) {
    try {
      const data = await cmsFetch<Parameters<typeof mapFaqs>[0]>("/api/public/faqs");
      const { categories } = mapFaqs(data);
      return categories.length ? categories : fixtureAdapter.listFaqCategories({ locale });
    } catch {
      return fixtureAdapter.listFaqCategories({ locale });
    }
  },

  // ---- Changelog ----------------------------------------------------------
  async listChangelog({ locale }): Promise<ChangelogEntry[]> {
    try {
      const raw = await cmsFetch<unknown>("/api/public/changelogs");
      const { items } = readListEnvelope(raw, "changelogs");
      const entries = items.map((c) =>
        mapChangelog(c as Parameters<typeof mapChangelog>[0]),
      );
      return entries.length ? entries : fixtureAdapter.listChangelog({ locale });
    } catch {
      return fixtureAdapter.listChangelog({ locale });
    }
  },

  // ---- Partners -----------------------------------------------------------
  async listPartners({ locale }): Promise<Partner[]> {
    try {
      const raw = await cmsFetch<unknown>("/api/public/partners");
      const { items } = readListEnvelope(raw, "partners");
      const partners = items.map((p) => mapPartner(p as Parameters<typeof mapPartner>[0]));
      return partners.length ? partners : fixtureAdapter.listPartners({ locale });
    } catch {
      return fixtureAdapter.listPartners({ locale });
    }
  },

  // ---- Reviews ------------------------------------------------------------
  async listReviews({ locale, limit }): Promise<Review[]> {
    try {
      const raw = await cmsFetch<unknown>("/api/public/opinions");
      const { items } = readListEnvelope(raw, "opinions");
      const reviews = items.map((o) => mapReview(o as Parameters<typeof mapReview>[0]));
      if (!reviews.length) return fixtureAdapter.listReviews({ locale, limit });
      return limit ? reviews.slice(0, limit) : reviews;
    } catch {
      return fixtureAdapter.listReviews({ locale, limit });
    }
  },

  /** No CMS endpoint — the Shopify App Store rating is the source of truth. */
  async getAggregateRating(): Promise<AggregateRating> {
    return { score: site.rating.score, count: site.rating.count };
  },

  // ---- Sitemap ------------------------------------------------------------
  async listAllContentRefs({ locale }): Promise<ContentRef[]> {
    const refs: ContentRef[] = [];
    try {
      const [postsRaw, docs, changelog, categories] = await Promise.all([
        cmsFetch<unknown>("/api/public/posts", { limit: 100, locale: apiLocale(locale) }),
        this.listDocs({ locale }),
        this.listChangelog({ locale }),
        this.listCategories({ locale }),
      ]);
      const postItems = readListEnvelope(postsRaw, "posts").items as Array<{
        slug: string;
        updatedAt?: string;
        publishedAt: string;
      }>;
      for (const p of postItems) {
        refs.push({ path: `/blog/${p.slug}`, updatedAt: p.updatedAt ?? p.publishedAt });
      }
      for (const c of categories) refs.push({ path: `/blog/category/${c.slug}`, updatedAt: "" });
      for (const d of docs) refs.push({ path: `/docs/${d.slug}`, updatedAt: d.updatedAt });
      void changelog;
      return refs.length ? refs : fixtureAdapter.listAllContentRefs({ locale });
    } catch {
      return fixtureAdapter.listAllContentRefs({ locale });
    }
  },
};
