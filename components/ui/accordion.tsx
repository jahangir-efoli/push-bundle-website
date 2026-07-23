"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Accordion for FAQ / docs (docs/PLAN.md §5.5).
 *
 * A11y: each header is a real <button> with aria-expanded + aria-controls;
 * each panel is a labelled region. Fully keyboard operable by default.
 * The open/close height animation is pure CSS (grid 0fr→1fr), so it costs
 * no JS and is already neutralised by the global reduced-motion rule.
 */

export type AccordionItem = {
  question: string;
  answer: React.ReactNode;
  /** Stable anchor id so questions are deep-linkable (§5.5). */
  slug?: string;
};

export function Accordion({
  items,
  allowMultiple = true,
  className,
}: {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set<number>();
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;

        return (
          <div key={item.slug ?? item.question} id={item.slug}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-foreground transition-colors hover:text-primary"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border border-border text-muted transition-transform duration-200",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-muted">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
