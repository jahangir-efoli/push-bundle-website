"use client";

import { useRef, useState } from "react";
import { AnimateIn } from "@/components/motion/animate-in";
import { ClientCard } from "@/components/client-showcase/client-card";
import { cn } from "@/lib/utils";
import type { ClientStory } from "@/lib/cms";

/** 12 = four full rows of the desktop 3-column grid (matches the blog). */
const PER_PAGE = 12;

/** Localized grid UI strings. */
export type ClientGridUi = {
  readMore: string;
  prev: string;
  next: string;
  paginationAria: string;
};

/**
 * Client showcase grid with client-side pagination — the partners pattern:
 * the full list comes from the server and we page through it here. Every
 * detail page is also in the sitemap, so crawlers reach stories beyond page 1.
 */
export function ClientGrid({ clients, ui }: { clients: ClientStory[]; ui: ClientGridUi }) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(clients.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PER_PAGE;
  const visible = clients.slice(start, start + PER_PAGE);

  const go = (n: number) => {
    setPage(n);
    topRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div ref={topRef} className="scroll-mt-28">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((client, i) => (
          <li key={client.slug} className="h-full min-w-0">
            <AnimateIn delay={(i % 3) * 0.08} className="h-full">
              <ClientCard client={client} readMore={ui.readMore} />
            </AnimateIn>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav
          aria-label={ui.paginationAria}
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => go(Math.max(1, current - 1))}
            disabled={current === 1}
            className="flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-subtle disabled:pointer-events-none disabled:opacity-40"
          >
            ← {ui.prev}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => go(n)}
              aria-current={n === current ? "page" : undefined}
              className={cn(
                "grid h-11 min-w-11 place-items-center rounded-lg px-3 text-sm font-semibold transition-colors",
                n === current
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-surface-subtle",
              )}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => go(Math.min(totalPages, current + 1))}
            disabled={current === totalPages}
            className="flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-subtle disabled:pointer-events-none disabled:opacity-40"
          >
            {ui.next} →
          </button>
        </nav>
      )}
    </div>
  );
}
