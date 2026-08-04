"use client";

import { useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

/** How long each item stays active before auto-advancing (ms). */
const DURATION = 4500;

export type WhyItem = {
  title: string;
  image: string;
  features: readonly string[];
};
export type WhyContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: readonly WhyItem[];
};

/**
 * "Why choose PushBundle" — a large rotating image synced to a vertical list of
 * reasons; the active reason is highlighted (brand blue), shows a progress bar,
 * and expands to its feature list. The progress bar's animation drives the
 * auto-advance, so timing stays in sync; it pauses on hover/focus and stops
 * under reduced-motion. Panels stay open without JS (`.js`-gated). Pass
 * `reverse` to mirror the layout (image on the right).
 */
export function WhyPushbundle({
  content,
  reverse = false,
  tone = "default",
}: {
  content: WhyContent;
  reverse?: boolean;
  tone?: "default" | "alt";
}) {
  const { eyebrow, title, subtitle, items } = content;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgOk, setImgOk] = useState<boolean[]>(() => items.map(() => true));
  const count = items.length;

  return (
    <Section tone={tone}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-display-md text-balance">{title}</h2>
      <p className="mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>

      <div
        className={cn(
          "mt-12 grid items-center gap-10 lg:gap-16",
          reverse
            ? "lg:grid-cols-[minmax(0,1fr)_1.35fr]"
            : "lg:grid-cols-[1.35fr_minmax(0,1fr)]",
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Synced image — crossfades to the active item. The image brings its
            own framing edge to edge, so we show it whole (object-contain) with
            no crop or rounded corners; the frame aspect matches the source
            (1700×1300 = 17:13) so it fills without letterbox bars. A soft
            elevation shadow lifts it off the page. */}
        <div
          className={cn(
            "min-w-0",
            reverse && "lg:order-2",
          )}
        >
          <div className="relative aspect-[17/13] overflow-hidden bg-surface-subtle shadow-lift">
            {items.map((item, i) => {
              const on = i === active;
              return imgOk[i] ? (
                <Image
                  key={item.image}
                  src={item.image}
                  alt={on ? item.title : ""}
                  aria-hidden={!on}
                  fill
                  // Text-heavy UI screenshots go soft at the default q75 on
                  // desktop, where this slot renders large; q95 keeps the type
                  // and fine lines crisp.
                  quality={95}
                  sizes="(min-width: 1024px) 44rem, 92vw"
                  className={cn(
                    "object-contain transition-opacity duration-500 ease-out motion-reduce:transition-none",
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
        <ul className={cn("min-w-0", reverse && "lg:order-1")}>
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
                      "flex w-full items-center py-4 pl-4 text-left text-lg font-semibold transition-colors",
                      on ? "text-primary" : "text-foreground hover:text-primary",
                    )}
                  >
                    {item.title}
                  </button>
                </h3>

                {/* Progress bar (active only) — its animationend advances. */}
                {on && (
                  <div className="mb-3 ml-4 h-1 overflow-hidden rounded-full bg-primary/15 motion-reduce:hidden">
                    <div
                      key={active}
                      onAnimationEnd={() => setActive((v) => (v + 1) % count)}
                      style={{
                        animationDuration: `${DURATION}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                      className="why-progress-fill h-full w-full rounded-full bg-primary"
                    />
                  </div>
                )}

                {/* Feature list — expands when active; open without JS (.js-gated) */}
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
