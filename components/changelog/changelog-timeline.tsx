"use client";

import { useMemo, useState } from "react";
import { MediaHolder } from "@/components/media/media-holder";
import { Badge, CHANGELOG_TONE } from "@/components/ui/badge";
import { AnimateIn } from "@/components/motion/animate-in";
import { cn } from "@/lib/utils";
import type { ChangelogEntry } from "@/lib/cms";

/**
 * Category display order. The filter tabs are DERIVED from the entries actually
 * returned by the CMS (see `categories` below) and shown in this order — so an
 * empty category never renders a dead tab. Each entry's category value comes
 * from the CMS; the adapter normalizes it into this known set.
 */
const CATEGORY_ORDER = [
  "New Feature",
  "Improved",
  "Fixed",
  "Recognition",
  "Launch",
] as const;

/** Entries per page before pagination kicks in. */
const PAGE_SIZE = 15;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Changelog timeline + category filter + pagination (docs/PLAN.md §5.9).
 * Client component for the filter/paging; entries come from the server.
 *
 * `body` is sanitized CMS HTML (headings, lists, images, tables) — rendered via
 * `prose-pb`, not printed as text. Filtering or paging resets to page 1.
 */
export function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [page, setPage] = useState(1);

  // Tabs reflect the CMS data: "All" + only the categories actually present,
  // in the canonical order.
  const categories = useMemo(() => {
    const present = new Set(entries.map((e) => e.category));
    return ["All", ...CATEGORY_ORDER.filter((c) => present.has(c))];
  }, [entries]);

  const visible = useMemo(
    () => (filter === "All" ? entries : entries.filter((e) => e.category === filter)),
    [entries, filter],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));

  // Clamp during render (no effect) so a shrunk filtered set can't leave us on
  // an out-of-range page.
  const current = Math.min(page, pageCount);

  const paged = useMemo(
    () => visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    [visible, current],
  );

  const selectFilter = (cat: string) => {
    setFilter(cat);
    setPage(1);
  };

  return (
    <div>
      {/* Filter */}
      <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={filter === cat}
            onClick={() => selectFilter(cat)}
            className={cn(
              "flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors",
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted hover:bg-surface-subtle hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline — a connected rail of dots with a card per release. */}
      <ol className="mt-10 space-y-6">
        {paged.map((entry, i) => {
          const last = i === paged.length - 1;
          return (
            <li
              key={entry.slug}
              id={entry.slug}
              className="relative scroll-mt-28 pl-8 sm:pl-10"
            >
              {/* Connector line to the next release (bridges the space-y gap). */}
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-6 h-[calc(100%+1.5rem)] w-px bg-border"
                />
              )}
              {/* Dot, aligned to the card's badge row; the ring punches it
                  cleanly through the connector line. */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-[1.4rem] size-3.5 rounded-full bg-primary ring-4 ring-background"
              />

              <AnimateIn direction="none">
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone={CHANGELOG_TONE[entry.category]}>
                      {entry.category}
                    </Badge>
                    <time dateTime={entry.date} className="text-sm text-muted">
                      {formatDate(entry.date)}
                    </time>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-bold wrap-break-word">
                    {entry.title}
                  </h2>

                  {entry.image && (
                    <MediaHolder
                      src={entry.image}
                      alt={entry.title}
                      ratio="aspect-video"
                      className="mt-4 max-w-xl rounded-xl border border-border"
                    />
                  )}

                  {/* CMS body is sanitized HTML — render it, don't print tags. */}
                  <div
                    className="prose-pb mt-3 max-w-none text-[15px]"
                    dangerouslySetInnerHTML={{ __html: entry.body }}
                  />
                </div>
              </AnimateIn>
            </li>
          );
        })}
      </ol>

      {visible.length === 0 && (
        <p className="mt-10 text-muted">No entries in this category yet.</p>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <nav
          aria-label="Changelog pages"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage(Math.max(1, current - 1))}
            disabled={current === 1}
            className="flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-surface-subtle disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-current={current === n ? "page" : undefined}
              onClick={() => setPage(n)}
              className={cn(
                "flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                current === n
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-surface-subtle",
              )}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount, current + 1))}
            disabled={current === pageCount}
            className="flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-surface-subtle disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
