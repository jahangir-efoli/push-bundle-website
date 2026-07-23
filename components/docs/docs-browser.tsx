"use client";

import { useMemo, useState } from "react";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Card } from "@/components/ui/card";
import { groupDocs } from "@/components/docs/docs-sidebar";
import type { DocArticle } from "@/lib/cms";

/**
 * Docs home browser (docs/PLAN.md §5.8a) — client-side search across every
 * article (title + category), grouped by category like the sidebar tree.
 */
export function DocsBrowser({ docs }: { docs: DocArticle[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const filtered = q
      ? docs.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.categoryName.toLowerCase().includes(q),
        )
      : docs;
    return groupDocs(filtered);
  }, [docs, q]);

  return (
    <div>
      <div className="max-w-md">
        <label htmlFor="docs-search" className="sr-only">
          Search documentation
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
            id="docs-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation…"
            className="h-12 w-full rounded-lg border border-border bg-surface pl-11 pr-4 text-foreground placeholder:text-muted focus-visible:border-primary"
          />
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="mt-10 text-muted" role="status">
          No articles match &ldquo;{query}&rdquo;. Try a different search.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.name}>
              <h2 className="text-display-sm">{group.name}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {group.items.map((doc) => (
                  <li key={doc.slug}>
                    <Link href={`/docs/${doc.slug}`} className="block">
                      <Card
                        interactive
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="min-w-0 font-medium text-foreground">
                          {doc.title}
                        </span>
                        <span aria-hidden="true" className="text-primary">
                          →
                        </span>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
