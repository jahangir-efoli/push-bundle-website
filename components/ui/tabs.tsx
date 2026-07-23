"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Tabs — WAI-ARIA tabs pattern (docs/PLAN.md §6 a11y).
 * Roving tabindex + Arrow/Home/End keyboard navigation.
 */

export type Tab = {
  label: string;
  content: React.ReactNode;
};

export function Tabs({
  tabs,
  className,
  label = "Content sections",
}: {
  tabs: Tab[];
  className?: string;
  /** Accessible name for the tablist. */
  label?: string;
}) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(active + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(active - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 border-b border-border"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.label}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "-mb-px h-12 rounded-t-lg border-b-2 px-4 font-semibold transition-colors",
                selected
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="py-6"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
