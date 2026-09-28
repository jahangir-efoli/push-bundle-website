"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/blog/toc";

/**
 * Sticky Table of Contents with scroll-spy (docs/PLAN.md §5.7c). Highlights the
 * section currently in view via IntersectionObserver. Anchors reuse the CMS's
 * own heading ids (see lib/blog/toc.ts).
 */
export function TableOfContents({
  items,
  className,
  /** Localized heading/label (defaults to English). */
  label = "Table of contents",
}: {
  items: TocItem[];
  className?: string;
  label?: string;
}) {
  const [active, setActive] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Trigger when a heading crosses the upper third of the viewport.
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // Keep the highlighted item visible: on a long TOC the active entry would
  // otherwise drift out of the scroll box as the reader moves down the page.
  // Only fires when the page scroll changes the active heading, so it never
  // fights someone scrolling the TOC itself.
  useEffect(() => {
    if (!active) return;
    const nav = navRef.current;
    const box = nav?.closest<HTMLElement>("[data-lenis-prevent]");
    const link = nav?.querySelector<HTMLElement>(`a[href="#${CSS.escape(active)}"]`);
    if (!box || !link) return;
    const b = box.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    const margin = 48;
    if (l.top >= b.top + margin && l.bottom <= b.bottom - margin) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({
      top: box.scrollTop + (l.top - b.top) - b.height / 3,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active]);

  if (!items.length) return null;

  return (
    <nav ref={navRef} aria-label={label} className={cn("text-sm", className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <ul className="mt-4 space-y-0.5 border-l border-border">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 transition-colors",
                  item.level === 3 ? "pl-7" : "pl-4",
                  isActive
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-muted hover:border-border hover:text-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
