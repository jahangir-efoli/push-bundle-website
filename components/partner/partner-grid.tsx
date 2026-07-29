"use client";

import { useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LogoHolder } from "@/components/media/media-holder";
import { AnimateIn } from "@/components/motion/animate-in";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/cms";

const PER_PAGE = 9;

/**
 * Partner grid with client-side pagination (docs/PLAN.md §5.6). The full set
 * comes from the server; we page through it 9 at a time so the directory stays
 * scannable as the ecosystem grows.
 */
/** Localized grid UI strings (defaults are English). */
export type PartnerGridUi = {
  visit: string;
  opensNewTab: string;
  prev: string;
  next: string;
  paginationAria: string;
};

const DEFAULT_UI: PartnerGridUi = {
  visit: "Visit",
  opensNewTab: "(opens in a new tab)",
  prev: "Prev",
  next: "Next",
  paginationAria: "Partner pagination",
};

export function PartnerGrid({
  partners,
  ui = DEFAULT_UI,
}: {
  partners: Partner[];
  ui?: PartnerGridUi;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(partners.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PER_PAGE;
  const visible = partners.slice(start, start + PER_PAGE);

  return (
    <div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((partner, i) => (
          <li key={partner.slug} className="h-full min-w-0">
            <AnimateIn delay={(i % 3) * 0.08} className="h-full">
              <Card className="flex h-full flex-col">
                <LogoHolder src={partner.logo} name={partner.name} />
                <CardTitle as="h2" className="mt-5 text-lg">
                  {partner.name}
                </CardTitle>
                <CardDescription className="flex-1">
                  {partner.description}
                </CardDescription>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                >
                  {ui.visit}
                  <span className="sr-only"> {partner.name} {ui.opensNewTab}</span>
                  <span aria-hidden="true" className="ml-1">
                    ↗
                  </span>
                </a>
              </Card>
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-subtle disabled:pointer-events-none disabled:opacity-40"
          >
            ← {ui.prev}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
