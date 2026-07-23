"use client";

import { useId, useRef, useState } from "react";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconTile, type IconName } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { showcase } from "@/lib/content/showcase";

/**
 * Interactive feature showcase (docs/PLAN.md §5.1) — a WAI-ARIA tabbed section
 * below the hero. Tab pills switch the panel; the LEFT panel is a placeholder
 * that each feature's live, interactive preview will replace later. Roving
 * tabindex + Arrow/Home/End keyboard nav.
 */
export function FeatureShowcase() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const features = showcase.features;
  const feature = features[active];

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
    <Section tone="alt">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>{showcase.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-display-md text-balance">{showcase.title}</h2>
        <p className="mt-4 text-lg text-muted">{showcase.subtitle}</p>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Bundle types"
        onKeyDown={onKeyDown}
        className="mt-10 flex flex-wrap justify-center gap-2"
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
                "flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border text-muted hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {f.tab}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
      >
        {/* LEFT — live interactive preview goes here (built per feature later). */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-1.5 shadow-lift">
          <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-4 overflow-hidden rounded-[0.85rem] bg-surface p-8 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  "linear-gradient(color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative flex flex-col items-center gap-4">
              <IconTile name={feature.icon as IconName} className="size-14" />
              <p className="font-display text-lg font-bold">{feature.title}</p>
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted">
                Interactive preview
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — feature copy */}
        <div>
          <div className="flex items-center gap-3">
            <IconTile name={feature.icon as IconName} className="size-11" />
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
              {feature.tab}
            </p>
          </div>
          <h3 className="mt-4 text-display-sm text-balance">{feature.title}</h3>
          <p className="mt-4 text-lg text-muted">{feature.description}</p>

          <div className="mt-6 rounded-xl border border-border bg-surface-subtle p-5">
            <p className="text-sm font-semibold text-foreground">How it works</p>
            <p className="mt-2 text-muted">{feature.howItWorks}</p>
          </div>

          <div className="mt-8">
            <a
              href={site.shopifyAppUrl}
              className={buttonStyles({ variant: "gradient", size: "lg" })}
            >
              {feature.cta}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
