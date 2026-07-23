"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * Scroll-triggered entrance reveal (docs/PLAN.md §6).
 *
 * Implemented with IntersectionObserver + CSS transitions rather than a
 * motion library: Lighthouse showed Motion pushing ~56 KiB of unused JS onto
 * the critical path and simulated LCP to 3.3s, breaking the §7 perf budget.
 * A fade/translate reveal does not need a physics engine. (`motion` stays
 * available for genuinely complex animation later — just not here.)
 *
 * Guardrails preserved:
 *  - animates only `transform` + `opacity`
 *  - honours `prefers-reduced-motion` (CSS, see globals.css)
 *  - degrades to fully visible content when JavaScript is unavailable
 *    (styles are gated behind the `js` class set by ThemeScript)
 */
export function AnimateIn({
  children,
  direction = "up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  /** Seconds, matching the previous Motion-based API. */
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reveal immediately if the user prefers reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.revealed = "true";
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={direction}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
