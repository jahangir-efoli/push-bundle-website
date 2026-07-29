"use client";

import { useMemo, useState } from "react";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { PostCard } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import { AnimateIn } from "@/components/motion/animate-in";
import { cn } from "@/lib/utils";
import type { Category, Post } from "@/lib/cms";

const pill = (active: boolean) =>
  cn(
    "flex h-9 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-wide transition-colors",
    active
      ? "border-primary bg-primary-subtle text-primary"
      : "border-border text-muted hover:border-foreground/30 hover:text-foreground",
  );

/**
 * Blog results region (docs/PLAN.md §5.7) — a category filter panel + client-
 * side search layered over the SEO-friendly server pagination.
 *
 * Category chips are real archive links (crawlable); counts reflect the posts
 * shown on this page. Search filters across ALL posts and hides pagination.
 */
/** Localized results UI strings (defaults are English). */
export type BlogResultsUi = {
  searchLabel: string;
  searchPlaceholder: string;
  filterByCategory: string;
  all: string;
  resultOne: string;
  resultOther: string;
  found: string;
  onThisPage: string;
  noMatch: string;
  noneYet: string;
  minRead: string;
};

const DEFAULT_UI: BlogResultsUi = {
  searchLabel: "Search articles",
  searchPlaceholder: "Search articles…",
  filterByCategory: "Filter by category",
  all: "All",
  resultOne: "result",
  resultOther: "results",
  found: "found",
  onThisPage: "on this page",
  noMatch: "No articles match your search. Try a different search.",
  noneYet: "No articles yet — check back soon.",
  minRead: "min read",
};

export function BlogResults({
  pagePosts,
  allPosts,
  categories,
  activeCategory,
  page,
  totalPages,
  basePath,
  ui = DEFAULT_UI,
}: {
  pagePosts: Post[];
  allPosts: Post[];
  categories: Category[];
  activeCategory?: string;
  page: number;
  totalPages: number;
  basePath: string;
  ui?: BlogResultsUi;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const results = useMemo(() => {
    if (!q) return pagePosts;
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [q, pagePosts, allPosts]);

  // Category chips shown = categories present in the visible posts, with counts.
  const chipCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of results) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return categories
      .filter((c) => counts.has(c.slug))
      .map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }));
  }, [results, categories]);

  return (
    <div>
      {/* Search */}
      <div className="mb-6 max-w-md">
        <label htmlFor="blog-search" className="sr-only">
          {ui.searchLabel}
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.searchPlaceholder}
            className="h-12 w-full rounded-lg border border-border bg-surface pl-11 pr-4 text-foreground placeholder:text-muted focus-visible:border-primary"
          />
        </div>
      </div>

      {/* Filter panel */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {ui.filterByCategory}
          </p>
          <p
            role="status"
            className="text-xs font-medium uppercase tracking-wider text-muted"
          >
            {results.length}{" "}
            {results.length === 1 ? ui.resultOne : ui.resultOther}{" "}
            {searching ? ui.found : ui.onThisPage}
          </p>
        </div>

        <nav aria-label="Blog categories" className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/blog"
            aria-current={!activeCategory ? "true" : undefined}
            className={pill(!activeCategory)}
          >
            {ui.all}
          </Link>
          {chipCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              aria-current={c.slug === activeCategory ? "true" : undefined}
              className={pill(c.slug === activeCategory)}
            >
              {c.name} ({c.count})
            </Link>
          ))}
        </nav>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        searching ? (
          <p className="mt-10 text-muted" role="status">
            {ui.noMatch}
          </p>
        ) : (
          <p className="mt-10 text-muted">{ui.noneYet}</p>
        )
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post, i) => (
            <li key={post.slug} className="h-full">
              <AnimateIn delay={(i % 3) * 0.08} className="h-full">
                {/* h2: these cards are the primary content under the page h1 */}
                <PostCard
                  post={post}
                  categories={categories}
                  titleAs="h2"
                  minReadLabel={ui.minRead}
                />
              </AnimateIn>
            </li>
          ))}
        </ul>
      )}

      {/* Numbered pagination applies only to the un-searched, server view. */}
      {!searching && (
        <Pagination page={page} totalPages={totalPages} basePath={basePath} />
      )}
    </div>
  );
}
