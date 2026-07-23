"use client";

import { useMemo, useState } from "react";
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Changelog timeline + badge filter (docs/PLAN.md §5.9).
 * Client component for the filter; entries come from the server.
 */
export function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");

  const visible = useMemo(
    () => (filter === "All" ? entries : entries.filter((e) => e.category === filter)),
    [entries, filter],
  );

  return (
    <div>
      {/* Filter */}
      <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={filter === cat}
            onClick={() => setFilter(cat)}
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
      <ol className="mt-10 space-y-8 border-l border-border pl-6">
        {visible.map((entry) => (
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
              <p className="mt-1 max-w-2xl text-muted wrap-break-word">
                {entry.body}
              </p>
            </AnimateIn>
          </li>
        ))}
      </ol>

      {visible.length === 0 && (
        <p className="mt-10 text-muted">No entries in this category yet.</p>
      )}
    </div>
  );
}
