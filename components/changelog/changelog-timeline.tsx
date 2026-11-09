"use client";

import { useMemo, useState } from "react";
import { MediaHolder } from "@/components/media/media-holder";
import { Badge, changelogTone } from "@/components/ui/badge";
import { AnimateIn } from "@/components/motion/animate-in";
import { cn } from "@/lib/utils";
import type { ChangelogEntry } from "@/lib/cms";

/**
 * Category display order. The filter tabs are DERIVED from the entries actually
 * returned by the CMS (see `categories` below) and shown in this order — so an
 * empty category never renders a dead tab. The adapter normalizes CMS labels
 * onto this known set; any other label gets a tab after these, in the order
 * it first appears. Entries with no label show no badge and only appear
 * under "All".
 */
const CATEGORY_ORDER: readonly string[] = [
  "New Feature",
  "Improved",
  "Fixed",
  "Recognition",
  "Launch",
];

/** Show "2.4.0" as "v2.4.0"; leave "v2.4.0" or free text like "Beta" alone. */
const formatVersion = (v: string) => (/^\d/.test(v) ? `v${v}` : v);

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
/** Localized timeline UI strings (defaults are English). Category names come
    from the CMS and are NOT translated here — only the "All" tab label. */
export type ChangelogUi = {
  all: string;
  filterAria: string;
  empty: string;
  previous: string;
  next: string;
  paginationAria: string;
};

const DEFAULT_UI: ChangelogUi = {
  all: "All",
  filterAria: "Filter by type",
  empty: "No entries in this category yet.",
  previous: "Previous",
  next: "Next",
  paginationAria: "Changelog pages",
};

export function ChangelogTimeline({
  entries,
  ui = DEFAULT_UI,
}: {
  entries: ChangelogEntry[];
  ui?: ChangelogUi;
}) {
  // null = "All" (kept out of the string space so no CMS label can collide).
  const [filter, setFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Tabs reflect the CMS data: only the categories actually present — known
  // ones in the canonical order, then any others in first-seen order.
  const categories = useMemo(() => {
    const present = new Set(
      entries.flatMap((e) => (e.category ? [e.category] : [])),
    );
    const known = CATEGORY_ORDER.filter((c) => present.has(c));
    const other = [...present].filter((c) => !CATEGORY_ORDER.includes(c));
    return [...known, ...other];
  }, [entries]);

  const visible = useMemo(
    () => (filter === null ? entries : entries.filter((e) => e.category === filter)),
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

  const selectFilter = (cat: string | null) => {
    setFilter(cat);
    setPage(1);
  };

  return (
    <div>
      {/* Filter — hidden when there's nothing to filter by (no labels set). */}
      {categories.length > 0 && (
        <div role="group" aria-label={ui.filterAria} className="flex flex-wrap gap-2">
          {[null, ...categories].map((cat) => (
            <button
              key={cat ?? "__all"}
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
              {cat ?? ui.all}
            </button>
          ))}
        </div>
      )}

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
                    {entry.category && (
                      <Badge tone={changelogTone(entry.category)}>
                        {entry.category}
                      </Badge>
                    )}
                    {entry.version && (
                      <span className="text-sm font-semibold text-foreground">
                        {formatVersion(entry.version)}
                      </span>
                    )}
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
        <p className="mt-10 text-muted">{ui.empty}</p>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <nav
          aria-label={ui.paginationAria}
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage(Math.max(1, current - 1))}
            disabled={current === 1}
            className="flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-surface-subtle disabled:pointer-events-none disabled:opacity-40"
          >
            {ui.previous}
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
            {ui.next}
          </button>
        </nav>
      )}
    </div>
  );
}
