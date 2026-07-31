"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Section } from "@/components/ui/section";
import { Icon, IconTile, type IconName } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { VolumeBundleStage } from "@/components/demos/volume-bundle-stage";
import { MixMatchSingleStage } from "@/components/demos/mix-match-single-stage";
import { MixMatchMultiStage } from "@/components/demos/mix-match-multi-stage";
import { CrossSellStage } from "@/components/demos/cross-sell-stage";
import { ByobStage } from "@/components/demos/byob-stage";
import { AutoCursor } from "@/components/demos/auto-cursor";
import { CartDrawer, type CartBundle } from "@/components/demos/cart-drawer";
import { installUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { showcase } from "@/lib/content/showcase";

/** Props the demo stages may accept (only some wire the cart drawer). */
type DemoProps = { onAddToCart?: (bundle: CartBundle) => void };

/** Interactive demos keyed by feature id (others show a placeholder for now). */
const DEMOS: Record<string, React.ComponentType<DemoProps>> = {
  volume: VolumeBundleStage,
  "cross-sell": CrossSellStage,
  "mix-single": MixMatchSingleStage,
  "mix-multi": MixMatchMultiStage,
  byob: ByobStage,
};

export type ShowcaseFeatureCopy = {
  tab: string;
  title: string;
  howItWorks: string;
  benefits: string;
  flexibility: string;
  cta: string;
};
export type ShowcaseContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  livePreview: string;
  chromeLabel: string;
  features: readonly ShowcaseFeatureCopy[];
};
export type ShowcaseLabels = {
  howItWorks: string;
  benefits: string;
  flexibility: string;
};

/** English defaults so the section renders without localized copy. */
const DEFAULT_CONTENT: ShowcaseContent = {
  eyebrow: showcase.eyebrow,
  title: showcase.title,
  subtitle: showcase.subtitle,
  livePreview: "Live — try it below",
  chromeLabel: "live preview",
  features: showcase.features.map((f) => ({
    tab: f.tab,
    title: f.title,
    howItWorks: f.howItWorks,
    benefits: f.benefits,
    flexibility: f.flexibility,
    cta: f.cta,
  })),
};
const DEFAULT_LABELS: ShowcaseLabels = {
  howItWorks: "How it Works",
  benefits: "Benefits",
  flexibility: "Flexibility",
};

/**
 * Interactive feature showcase (docs/PLAN.md §5.1) — a WAI-ARIA tabbed section
 * below the hero. Icon tab pills switch the panel; the LEFT panel is a large
 * app-window placeholder that each feature's live interactive preview replaces
 * later. Roving tabindex + Arrow/Home/End keyboard nav.
 */
export function FeatureShowcase({
  content = DEFAULT_CONTENT,
  labels = DEFAULT_LABELS,
}: {
  content?: ShowcaseContent;
  labels?: ShowcaseLabels;
} = {}) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const [cart, setCart] = useState<CartBundle | null>(null);
  const [cue, setCue] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const tabbarRef = useRef<HTMLDivElement>(null);

  // Fire the tab-bar entrance attention pulse once, when it scrolls into view.
  useEffect(() => {
    const el = tabbarRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            setCue(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Localized text comes from `content`; icons + demo components stay keyed in
  // code (`showcase.features`) and are matched to the text by index.
  const meta = showcase.features;
  const features = content.features;
  const feature = features[active];
  const Demo = DEMOS[meta[active].id];

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
    <Section
      tone="default"
      className="border-y border-[#ece6dc] bg-[#f4efe7] text-[#23201c]"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold tracking-[0.16em] text-[#2f5d50] uppercase">
          {content.eyebrow}
        </span>
        <h2 className="mt-3 text-display-md text-balance text-[#23201c]">
          {content.title}
        </h2>
        <p className="mt-4 text-lg text-[#6f685c]">{content.subtitle}</p>
      </div>

      {/* Tabs — individual pills; the active one is the blue→cyan gradient. The
          whole bar plays a one-time entrance pulse when it scrolls into view. */}
      <div
        ref={tabbarRef}
        role="tablist"
        aria-label="Bundle types"
        onKeyDown={onKeyDown}
        className={cn(
          "mt-10 flex flex-wrap justify-center gap-2.5",
          cue && "pbfs-cue",
        )}
      >
        {features.map((f, i) => {
          const selected = i === active;
          return (
            <button
              key={meta[i].id}
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
              style={
                selected
                  ? { backgroundImage: "linear-gradient(90deg,#3b82f6,#22d3ee)" }
                  : undefined
              }
              className={cn(
                "pbfs-tab inline-flex cursor-pointer items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors duration-200",
                selected
                  ? "border-transparent text-white shadow-[0_8px_18px_rgba(59,130,246,0.26)]"
                  : "border-[#ece6dc] bg-white text-[#6f685c] hover:border-[#d8cfc0] hover:text-[#23201c]",
                selected && "pbfs-glow",
              )}
            >
              <Icon
                name={meta[i].icon as IconName}
                className={cn(
                  "size-4 shrink-0",
                  selected ? "text-white" : "text-[#3b82f6]",
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
        className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12"
      >
        {/* LEFT — large app-window placeholder (live preview goes here later).
            `pb-light` pins the preview to the light token set so it always reads
            as a real (white) storefront, even when the site is in dark mode. */}
        {/* Light cyan→teal frame (no dark indigo end, no drop shadow). The
            right-side "shadow" was never this frame — it was the closed cart
            drawer's leftward shadow bleeding in; that's fixed at its source. */}
        <div
          className="rounded-2xl p-1.5"
          style={{
            backgroundImage:
              "linear-gradient(135deg, color-mix(in oklab, var(--pb-cyan-400) 45%, transparent), color-mix(in oklab, var(--pb-teal-500) 40%, transparent))",
          }}
        >
          <div
            ref={previewRef}
            className="pb-light relative overflow-hidden rounded-[0.9rem] bg-surface text-foreground"
          >
            {/* Faux app chrome — traffic lights + window title on the left, the
                live-preview cue on the right (its home in the header). */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-warm/70" />
                <span className="size-2.5 rounded-full bg-warning/70" />
                <span className="size-2.5 rounded-full bg-success/70" />
              </span>
              <span className="ml-2 truncate text-xs text-muted">
                {feature.title} — {content.chromeLabel}
              </span>
              <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[11px] font-semibold whitespace-nowrap text-primary sm:flex">
                <span className="relative flex size-2" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#c81e63]/60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#c81e63]" />
                </span>
                {content.livePreview}
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
                <Demo onAddToCart={setCart} />
              </div>
            ) : null}

            {/* Ghost-cursor auto-demo — only on the Volume tab; auto-clicks a
                couple of tiers to show the preview is live, then invites the
                visitor to take over. */}
            {meta[active].id === "volume" && (
              <AutoCursor containerRef={previewRef} tierQtys={[2, 4]} autoFill />
            )}

            {/* Slide-in cart drawer — opens over the storefront when a bundle is
                added to cart, showing it as one line item with nested units. */}
            <CartDrawer bundle={cart} onClose={() => setCart(null)} />

            {!Demo && (
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
                  <IconTile name={meta[active].icon as IconName} className="size-16" />
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

        {/* RIGHT — compact feature copy (reference palette) */}
        <div>
          <h3 className="text-display-sm text-balance text-[#23201c]">
            {feature.title}
          </h3>

          <div className="mt-6 space-y-5">
            {[
              { label: labels.howItWorks, body: feature.howItWorks },
              { label: labels.benefits, body: feature.benefits },
              { label: labels.flexibility, body: feature.flexibility },
            ].map((s) => (
              <div key={s.label}>
                <h4 className="text-xs font-bold tracking-[0.12em] text-[#2f5d50] uppercase">
                  {s.label}
                </h4>
                <p className="mt-1.5 text-base leading-relaxed text-[#6f685c]">
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
