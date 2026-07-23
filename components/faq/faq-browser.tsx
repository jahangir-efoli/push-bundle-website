"use client";

import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/cms";

type Category = { slug: string; name: string };

/**
 * Searchable, categorized FAQ (docs/PLAN.md §5.5).
 * Client-side filter over the CMS items; `FAQPage` JSON-LD is emitted by the
 * server page from the full set (search must not shrink structured data).
 */
export function FaqBrowser({
  items,
  categories,
}: {
  items: FaqItem[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.question.toLowerCase().includes(q) ||
        i.answer.toLowerCase().includes(q),
    );
  }, [items, query]);

  const groups = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          items: filtered.filter((i) => i.category === c.slug),
        }))
        .filter((g) => g.items.length > 0),
    [categories, filtered],
  );

  return (
    <div>
      <div className="max-w-md">
        <label htmlFor="faq-search" className="sr-only">
          Search questions
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-foreground placeholder:text-muted focus-visible:border-primary"
        />
      </div>

      {groups.length === 0 ? (
        <p className="mt-10 text-muted" role="status">
          No questions match &ldquo;{query}&rdquo;. Try a different search.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.slug} aria-labelledby={`faq-${group.slug}`}>
              <h2 id={`faq-${group.slug}`} className="text-display-sm">
                {group.name}
              </h2>
              <Accordion
                className="mt-4"
                items={group.items.map((i) => ({
                  question: i.question,
                  answer: i.answer,
                  slug: i.slug,
                }))}
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
