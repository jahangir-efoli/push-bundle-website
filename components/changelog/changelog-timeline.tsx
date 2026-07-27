"use client";

import { useMemo, useState } from "react";
import { MediaHolder } from "@/components/media/media-holder";
import { Badge, CHANGELOG_TONE } from "@/components/ui/badge";
import { AnimateIn } from "@/components/motion/animate-in";
import { cn } from "@/lib/utils";
import type { ChangelogEntry } from "@/lib/cms";

const CATEGORIES = [
  "All",
  "New Feature",
  "Improved",
  "Fixed",
  "Recognition",
  "Launch",
] as const;

/** Entries per page before pagination kicks in. */
const PAGE_SIZE = 8;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Changelog timeline + badge filter + pagination (docs/PLAN.md §5.9).
 * Client component for the filter/paging; entries come from the server.
 *
 * `body` is sanitized CMS HTML (headings, lists, images, tables) — rendered via
 * `prose-pb`, not printed as text. Filtering or paging resets to page 1.
 */
export function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [page, setPage] = useState(1);

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

  const selectFilter = (cat: (typeof CATEGORIES)[number]) => {
    setFilter(cat);
    setPage(1);
  };

  return (
    <div>
      {/* Filter */}
      <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={filter === cat}
            onClick={() => selectFilter(cat)}
            className={cn(
              "flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors",
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-surface-subtle",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <ol className="mt-10 space-y-10 border-l border-border pl-6">
        {paged.map((entry) => (
          <li key={entry.slug} id={entry.slug} className="relative scroll-mt-24">
            <span
              aria-hidden="true"
              className="absolute -left-[1.6rem] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
            />
            <AnimateIn direction="none">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={CHANGELOG_TONE[entry.category]}>{entry.category}</Badge>
                <time dateTime={entry.date} className="text-sm text-muted">
                  {formatDate(entry.date)}
                </time>
              </div>
              <h2 className="mt-2 font-display text-lg font-bold wrap-break-word">
                {entry.title}
              </h2>

              {entry.image && (
                <MediaHolder
                  src={entry.image}
                  alt={entry.title}
                  ratio="aspect-video"
                  className="mt-4 max-w-2xl rounded-2xl border border-border"
                />
              )}

              {/* CMS body is sanitized HTML — render it, don't print the tags. */}
              <div
                className="prose-pb mt-3 max-w-2xl text-base"
                dangerouslySetInnerHTML={{ __html: entry.body }}
              />
            </AnimateIn>
          </li>
        ))}
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
