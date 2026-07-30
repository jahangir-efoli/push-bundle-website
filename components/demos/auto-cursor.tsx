"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Ghost-cursor auto-demo. When the referenced preview container first scrolls
 * into view, a small cursor appears and auto-clicks a couple of targets (by
 * their `data-tier-qty` value) so the visitor sees the preview respond on its
 * own — then a "Your turn — click anything" nudge appears. Any real interaction
 * (pointerdown) stops it immediately. Disabled under prefers-reduced-motion.
 *
 * Render this INSIDE the (position:relative) preview container so the cursor's
 * coordinates line up with the targets.
 */
export function AutoCursor({
  containerRef,
  tierQtys = [2, 4],
}: {
  containerRef: RefObject<HTMLElement | null>;
  /** `data-tier-qty` values to auto-click, in order. */
  tierQtys?: number[];
}) {
  const ghostRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const nudgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const ghost = ghostRef.current;
    const ripple = rippleRef.current;
    const nudge = nudgeRef.current;
    if (!container || !ghost || !ripple || !nudge) return;
    if (window.matchMedia?.("(prefers-reduced-motion:reduce)").matches) return;

    const targets = tierQtys.map((q) =>
      container.querySelector<HTMLElement>(`[data-tier-qty="${q}"]`),
    );
    if (targets.some((t) => !t)) return;
    const [t0, t1] = targets as HTMLElement[];

    let done = false;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!done) fn();
        }, ms),
      );
    };
    const rel = (el: HTMLElement) => {
      const pr = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - pr.left + 40, y: r.top - pr.top + r.height / 2 };
    };
    const moveTo = (el: HTMLElement) => {
      const p = rel(el);
      ghost.style.transform = `translate(${p.x}px,${p.y}px)`;
    };
    const tap = (el: HTMLElement) => {
      const p = rel(el);
      ripple.style.left = `${p.x}px`;
      ripple.style.top = `${p.y}px`;
      ripple.classList.remove("go");
      void ripple.offsetWidth;
      ripple.classList.add("go");
      ghost.classList.add("tap");
      ghost.style.transform = `translate(${p.x}px,${p.y}px) scale(.8)`;
      window.setTimeout(() => {
        ghost.classList.remove("tap");
        ghost.style.transform = `translate(${p.x}px,${p.y}px)`;
      }, 150);
    };
    const stop = () => {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      ghost.style.opacity = "0";
      nudge.classList.remove("show");
    };
    container.addEventListener("pointerdown", stop, { once: true });

    const run = () => {
      if (done) return;
      ghost.style.transform = `translate(${container.clientWidth * 0.5}px,${container.clientHeight * 0.7}px)`;
      at(250, () => (ghost.style.opacity = "1"));
      at(650, () => moveTo(t0));
      at(1750, () => tap(t0));
      at(1880, () => t0.click());
      at(2750, () => moveTo(t1));
      at(3850, () => tap(t1));
      at(3980, () => t1.click());
      at(4650, () => (ghost.style.opacity = "0"));
      at(5000, () => nudge.classList.add("show"));
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (ents) => {
          ents.forEach((e) => {
            if (e.isIntersecting && !done) {
              run();
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -35% 0px" },
      );
      io.observe(container);
    } else {
      run();
    }

    return () => {
      done = true;
      timers.forEach(clearTimeout);
      io?.disconnect();
      container.removeEventListener("pointerdown", stop);
    };
    // Run once when mounted (i.e. when the Volume tab becomes active).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div ref={ghostRef} className="pb-ghost">
        <svg
          viewBox="0 0 24 24"
          fill="#fff"
          stroke="#1f2430"
          strokeWidth="1.3"
          strokeLinejoin="round"
        >
          <path d="M5 2.5l14 7-6 2-2 6z" />
        </svg>
      </div>
      <div ref={rippleRef} className="pb-ripple" />
      <div ref={nudgeRef} className="pb-trynudge">
        👆 Your turn — click anything
      </div>
    </div>
  );
}
