"use client";

import { useId, useRef, useState } from "react";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon, IconTile, type IconName } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { VolumeBundleStage } from "@/components/demos/volume-bundle-stage";
import { MixMatchSingleStage } from "@/components/demos/mix-match-single-stage";
import { MixMatchMultiStage } from "@/components/demos/mix-match-multi-stage";
import { CrossSellStage } from "@/components/demos/cross-sell-stage";
import { ByobStage } from "@/components/demos/byob-stage";
import { installUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { showcase } from "@/lib/content/showcase";

/** Interactive demos keyed by feature id (others show a placeholder for now). */
const DEMOS: Record<string, React.ComponentType> = {
  volume: VolumeBundleStage,
  "cross-sell": CrossSellStage,
  "mix-single": MixMatchSingleStage,
  "mix-multi": MixMatchMultiStage,
  byob: ByobStage,
};

/**
 * Interactive feature showcase (docs/PLAN.md §5.1) — a WAI-ARIA tabbed section
 * below the hero. Icon tab pills switch the panel; the LEFT panel is a large
 * app-window placeholder that each feature's live interactive preview replaces
 * later. Roving tabindex + Arrow/Home/End keyboard nav.
 */
export function FeatureShowcase() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const features = showcase.features;
  const feature = features[active];
  const Demo = DEMOS[feature.id];

  const focusTab = (index: number) => {
    const next = (index + features.length) % features.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusTab(active + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusTab(active - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(features.length - 1);
        break;
    }
  };

  return (
    <Section tone="default" className="showcase-glow">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>{showcase.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-display-md text-balance">{showcase.title}</h2>
        <p className="mt-4 text-lg text-muted">{showcase.subtitle}</p>
      </div>

      {/* Tabs — a segmented control, so it clearly reads as clickable tabs that
          switch the live preview below (not static chips). */}
      <div className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label="Bundle types"
          onKeyDown={onKeyDown}
          className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-border bg-surface/70 p-1.5 shadow-soft backdrop-blur-sm"
        >
          {features.map((f, i) => {
            const selected = i === active;
            return (
              <button
                key={f.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-[color,background-color,box-shadow] duration-200",
                  selected
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted hover:bg-surface-subtle hover:text-foreground",
                )}
              >
                <Icon
                  name={f.icon as IconName}
                  className={cn(
                    "size-4 shrink-0",
                    selected ? "text-primary-foreground" : "text-primary",
                  )}
                />
                {f.tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cue: the tabs drive the live, interactive preview below. */}
      <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        Live, interactive preview — try it below
      </p>

      {/* Panel — preview is the star; copy is the supporting column. */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12"
      >
        {/* LEFT — large app-window placeholder (live preview goes here later).
            `pb-light` pins the preview to the light token set so it always reads
            as a real (white) storefront, even when the site is in dark mode. */}
        <div className="rounded-2xl bg-gradient-border p-1.5 shadow-lift">
          <div className="pb-light overflow-hidden rounded-[0.9rem] bg-surface text-foreground">
            {/* Faux app chrome */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-warm/70" />
                <span className="size-2.5 rounded-full bg-warning/70" />
                <span className="size-2.5 rounded-full bg-success/70" />
              </span>
              <span className="ml-2 truncate text-xs text-muted">
                {feature.title} — live preview
              </span>
            </div>

            {/* Body — interactive demo when available, else a placeholder. */}
            {Demo ? (
              // data-lenis-prevent: let this box scroll natively instead of
              // Lenis hijacking the wheel for the whole page.
              <div
                data-lenis-prevent
                className="scrollbar-brand max-h-128 overflow-y-auto"
              >
                {/* Demos pad themselves so a sticky footer can sit flush. */}
                <Demo />
              </div>
            ) : (
              <div className="relative flex aspect-16/10 flex-col items-center justify-center gap-5 overflow-hidden p-8 text-center">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.5]"
                  style={{
                    backgroundImage:
                      "linear-gradient(color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div className="relative flex flex-col items-center gap-5">
                  <IconTile name={feature.icon as IconName} className="size-16" />
                  <p className="font-display text-xl font-bold">
                    {feature.title}
                  </p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted">
                    <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                    Interactive preview
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — compact feature copy */}
        <div>
          <h3 className="text-display-sm text-balance">{feature.title}</h3>

          <div className="mt-6 space-y-6">
            {[
              { label: "How it Works", body: feature.howItWorks },
              { label: "Benefits", body: feature.benefits },
              { label: "Flexibility", body: feature.flexibility },
            ].map((s) => (
              <div key={s.label}>
                <h4 className="text-base font-bold text-foreground">{s.label}</h4>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href={installUrl("feature-showcase")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "gradient" })}
            >
              {feature.cta}
              <span className="sr-only"> (opens in a new tab)</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
