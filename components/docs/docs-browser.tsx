"use client";

import { useMemo, useState } from "react";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Icon } from "@/components/ui/icon";
import { groupDocs } from "@/components/docs/docs-sidebar";
import type { DocArticle } from "@/lib/cms";

/**
 * Docs home browser (docs/PLAN.md §5.8a) — client-side search across every
 * article (title + category), grouped by category like the sidebar tree.
 *
 * Each article is a scannable row: a document icon, the title, and an arrow
 * that slides on hover. Rows read left-to-right so the eye lands on the title,
 * not empty space.
 */
/** Localized browser UI strings (defaults are English). */
export type DocsBrowserUi = {
  searchLabel: string;
  searchPlaceholder: string;
  resultOne: string;
  resultOther: string;
  forQuery: string;
  noResultsTitle: string;
  noResultsBody: string;
};

const DEFAULT_UI: DocsBrowserUi = {
  searchLabel: "Search documentation",
  searchPlaceholder: "Search the docs…",
  resultOne: "result",
  resultOther: "results",
  forQuery: "for",
  noResultsTitle: "No results found",
  noResultsBody:
    "Nothing matches your search. Try a different term or browse the categories.",
};

export function DocsBrowser({
  docs,
  ui = DEFAULT_UI,
}: {
  docs: DocArticle[];
  ui?: DocsBrowserUi;
}) {
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

  const total = useMemo(
    () => groups.reduce((n, g) => n + g.items.length, 0),
    [groups],
  );

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-xl">
        <label htmlFor="docs-search" className="sr-only">
          {ui.searchLabel}
        </label>
        <div className="group relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary"
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
            placeholder={ui.searchPlaceholder}
            className="h-13 w-full rounded-xl border border-border bg-surface pl-12 pr-4 text-foreground shadow-soft placeholder:text-muted focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
          />
        </div>
        {q && (
          <p className="mt-3 text-center text-sm text-muted" role="status">
            {total} {total === 1 ? ui.resultOne : ui.resultOther} {ui.forQuery}{" "}
            &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-border bg-surface-subtle p-8 text-center">
          <p className="font-display text-lg font-bold">{ui.noResultsTitle}</p>
          <p className="mt-2 text-muted">{ui.noResultsBody}</p>
        </div>
      ) : (
        <div className="mt-14 space-y-14">
          {groups.map((group) => (
            <section key={group.name}>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-bold sm:text-2xl">
                  {group.name}
                </h2>
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-subtle px-2 text-xs font-semibold text-muted">
                  {group.items.length}
                </span>
              </div>

              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {group.items.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-soft transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {/* Leading document tile */}
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon name="file-text" className="size-5" />
                      </span>

                      <span className="min-w-0 flex-1 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {doc.title}
                      </span>

                      {/* Real arrow icon that slides on hover */}
                      <Icon
                        name="arrow-right"
                        className="size-5 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-primary"
                      />
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
