"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";
import { whyPushbundle } from "@/lib/content/home";

const INTERVAL = 4200;

/**
 * "Why choose PushBundle" — a vertical list of reasons on the right, each
 * expanding to a feature list, synced to a rotating image on the left. Auto-
 * advances, pauses on hover/focus, respects reduced-motion, and lets you click
 * a reason to jump to it. Add per-item images at `whyPushbundle.items[].image`.
 */
export function WhyPushbundle() {
  const { eyebrow, title, subtitle, items } = whyPushbundle;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgOk, setImgOk] = useState<boolean[]>(() => items.map(() => true));
  const count = items.length;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((v) => (v + 1) % count),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [paused, count]);

  return (
    <Section>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-display-md text-balance">{title}</h2>
      <p className="mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>

      <div
        className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Synced image — crossfades to the active item */}
        <div className="min-w-0 rounded-2xl bg-brand-gradient p-1.5 shadow-lift">
          <div className="relative aspect-4/3 overflow-hidden rounded-[0.9rem] bg-surface-subtle">
            {items.map((item, i) => {
              const on = i === active;
              return imgOk[i] ? (
                <Image
                  key={item.image}
                  src={item.image}
                  alt={on ? item.title : ""}
                  aria-hidden={!on}
                  fill
                  sizes="(min-width: 1024px) 40rem, 92vw"
                  className={cn(
                    "object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none",
                    on ? "opacity-100" : "opacity-0",
                  )}
                  onError={() =>
                    setImgOk((prev) =>
                      prev.map((v, idx) => (idx === i ? false : v)),
                    )
                  }
                />
              ) : on ? (
                <div
                  key={item.image}
                  className="absolute inset-0 grid place-items-center p-8 text-center"
                >
                  <span className="flex flex-col items-center gap-2 text-sm text-muted">
                    <svg viewBox="0 0 24 24" className="size-9 text-muted/50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20" />
                    </svg>
                    {item.title}
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Reasons — an accordion synced to the image */}
        <ul className="min-w-0">
          {items.map((item, i) => {
            const on = i === active;
            return (
              <li key={item.title} className="border-b border-border first:border-t">
                <h3>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className={cn(
                      "flex w-full items-center gap-3 py-4 text-left text-lg font-semibold transition-colors",
                      on ? "text-primary" : "text-foreground hover:text-primary",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-6 w-1 shrink-0 rounded-full transition-colors",
                        on ? "bg-primary" : "bg-transparent",
                      )}
                    />
                    {item.title}
                  </button>
                </h3>
                {/* Feature list — expands when active (grid-rows height trick) */}
                <div
                  data-open={on}
                  className="why-panel grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-2.5 pb-5 pl-4">
                      {item.features.map((f) => (
                        <li key={f} className="flex gap-2.5 text-muted">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-subtle text-primary"
                          >
                            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m5 13 4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-sm leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
