"use client";

import { useId, useRef, useState } from "react";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon, IconTile, type IconName } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { VolumeBundleDemo } from "@/components/demos/volume-bundle-demo";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { showcase } from "@/lib/content/showcase";

/** Interactive demos keyed by feature id (others show a placeholder for now). */
const DEMOS: Record<string, React.ComponentType> = {
  volume: VolumeBundleDemo,
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
    <Section tone="alt">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>{showcase.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-display-md text-balance">{showcase.title}</h2>
        <p className="mt-4 text-lg text-muted">{showcase.subtitle}</p>
      </div>

      {/* Tabs — icon pills */}
      <div
        role="tablist"
        aria-label="Bundle types"
        onKeyDown={onKeyDown}
        className="mt-10 flex flex-wrap justify-center gap-2.5"
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
                "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-200",
                selected
                  ? "-translate-y-px border-transparent bg-primary text-primary-foreground shadow-glow"
                  : "border-border bg-surface text-muted hover:border-primary/40 hover:text-foreground hover:shadow-soft",
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

      {/* Panel — preview is the star; copy is the supporting column. */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-12 grid items-center gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12"
      >
        {/* LEFT — large app-window placeholder (live preview goes here later). */}
        <div className="rounded-2xl bg-brand-gradient p-1.5 shadow-lift">
          <div className="overflow-hidden rounded-[0.9rem] bg-surface">
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
              <div className="max-h-[32rem] overflow-y-auto p-4 sm:p-5">
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
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <Icon name={feature.icon as IconName} className="size-4" />
            {feature.tab}
          </span>
          <h3 className="mt-4 text-display-sm text-balance">{feature.title}</h3>
          <p className="mt-3 text-muted">{feature.description}</p>

          <div className="mt-5 rounded-xl border border-border bg-surface-subtle p-4">
            <p className="text-sm font-semibold text-foreground">How it works</p>
            <p className="mt-1 text-sm text-muted">{feature.howItWorks}</p>
          </div>

          <div className="mt-6">
            <a
              href={site.shopifyAppUrl}
              className={buttonStyles({ variant: "gradient" })}
            >
              {feature.cta}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
