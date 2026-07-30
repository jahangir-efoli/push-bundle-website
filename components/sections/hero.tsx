import { Fragment } from "react";
import { buttonStyles } from "@/components/ui/button";
import { HeroSlider } from "@/components/sections/hero-slider";
import { ShopifyMark } from "@/components/ui/shopify-mark";
import { site, installUrl } from "@/lib/site-config";
import { hero } from "@/lib/content/home";
import type { AggregateRating } from "@/lib/cms";

/**
 * Feature previews shown in the hero slider — LANDSCAPE (4:3) screenshots at
 * /images/hero/hero-1..5.png. Until those assets are added, each slide shows a
 * branded placeholder (see HeroSlider). Recommended size: 1600×1200 (4:3).
 */
const HERO_SLIDES = [
  {
    src: "/images/hero/hero-1.png",
    alt: "PushBundle mix-and-match single-product bundle builder with tiered box discounts",
  },
  {
    src: "/images/hero/hero-2.png",
    alt: "PushBundle mix-and-match multi-product bundle builder across product categories",
  },
  {
    src: "/images/hero/hero-3.png",
    alt: "PushBundle build-your-own gift box flow with step-by-step product selection",
  },
  {
    src: "/images/hero/hero-4.png",
    alt: "PushBundle cross-sell bundle pairing complementary products at a set discount",
  },
  {
    src: "/images/hero/hero-5.png",
    alt: "PushBundle volume bundle offering buy-more-save-more quantity discounts",
  },
];

/**
 * Hero (docs/PLAN.md §5.1 §2) — the LCP section.
 *
 * Light, airy treatment: near-white surface with soft brand-tinted radial
 * washes. Uses semantic tokens, so it flips correctly in dark mode.
 *
 * Server-rendered and animation-free — the H1 paints from HTML + CSS and never
 * waits on JavaScript (§7). Depth is CSS radial-gradients rather than large
 * blurred elements, which were measurably expensive to paint.
 *
 * Vertical rhythm is deliberately tight: the full hero (including the
 * compatibility chips) must fit above the fold on ~650px-tall viewports.
 */
export type HeroContent = {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  trustedSecure: string;
  microcopy: string;
};

/** English defaults so pages that don't pass localized copy still render. */
const DEFAULT_HERO: HeroContent = {
  title: hero.title,
  subtitle: hero.subtitle,
  primaryCta: hero.primaryCta,
  secondaryCta: hero.secondaryCta,
  trustedSecure: "Trusted & secure",
  microcopy: "Free plan available · 14-day trial · No credit card",
};

export function Hero({
  rating,
  content = DEFAULT_HERO,
}: {
  rating: AggregateRating;
  content?: HeroContent;
}) {
  return (
    // Pull up under the floating header (-mt-24) so the hero background fills
    // the whole top of the viewport, behind the transparent pill — no seam.
    // pt-24 keeps the content clear of the header. `svh` (not `vh`) so mobile
    // browser chrome doesn't push content off-screen; `min-h` (not `h`) so the
    // hero can still grow on short screens or with longer translated copy.
    <section className="relative isolate -mt-24 flex min-h-svh items-center overflow-hidden bg-background pt-24 text-foreground">
      {/* Soft brand washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: [
            "radial-gradient(48rem 30rem at 8% -18%, rgba(47,107,255,.20), transparent 62%)",
            "radial-gradient(40rem 28rem at 92% 0%, rgba(58,217,238,.18), transparent 62%)",
            "radial-gradient(44rem 30rem at 60% 120%, rgba(30,39,214,.12), transparent 62%)",
          ].join(","),
        }}
      />

      {/* Fine grid overlay, faded toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] dark:opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,16,32,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,16,32,.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 85% 70% at 50% 0%, #000 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 70% at 50% 0%, #000 35%, transparent 100%)",
        }}
      />

      {/* Full-bleed hero: content spans the full viewport width (only the hero
          is uncapped — every other section stays at max-w-site). Larger
          responsive side padding than the standard gutter so the content
          breathes against the screen edges. */}
      <div className="relative grid w-full items-center gap-8 px-6 pt-8 pb-16 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:px-20 lg:pt-10 lg:pb-20 xl:px-28">
        <div>
          {/* Trust signals — two distinct pills:
              1) the official "Built for Shopify" badge (brand-tinted highlight)
              2) a "Trusted & secure" pill carrying the live rating, linked to
                 the Shopify App Store listing. */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Pill 1 — Built for Shopify (highlighted) */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/25 shadow-soft">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 14"
                className="h-3.5 w-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m13 0-1 5-4 9 8-9.5L13 0ZM3 0l1 5 4 9-8-9.5L3 0Z" fill="#1495CC" />
                <path d="m3 0 1 5 4 9 4-9 1-5H3Z" fill="#58B7DF" />
                <path d="M8 14 4 5l-4-.5L8 14ZM8 14l4-9 4-.5L8 14Z" fill="#035F86" />
                <path d="M8 5.5 4 5l4 9 4-9-4 .5Z" fill="#1495CC" />
                <path d="m4 5 4-5 4 5-4.001.5L4 5Z" fill="#A9DEF4" />
                <path d="M4 5 3 0h5L4 5ZM12 5l1-5H8l4 5Z" fill="#58B7DF" />
                <path d="M4 5 3 0 0 4.5 4 5ZM12 5l1-5 3 4.5-4 .5Z" fill="#1495CC" />
              </svg>
              Built for Shopify
            </span>

            {/* Pill 2 — Trusted & secure + live rating (links to the listing) */}
            <a
              href={installUrl("hero-rating")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Trusted and secure — rated ${rating.score} out of 5 on the Shopify App Store (opens in a new tab)`}
              className="group/trust inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold shadow-soft transition-colors hover:border-primary/40"
            >
              <ShopifyMark className="size-4" />
              <span className="text-muted group-hover/trust:text-foreground">
                {content.trustedSecure}
              </span>
              <span aria-hidden="true" className="h-4 w-px bg-border" />
              <span className="flex items-center gap-1">
                <span className="text-warning">★</span>
                <span className="font-bold text-foreground">{rating.score}</span>
                <span className="text-muted">/ 5</span>
              </span>
            </a>
          </div>

          {/* Title reveals character-by-character once on load (pb-write-char),
              split server-side into per-word / per-char spans (no client JS).
              aria-label gives assistive tech the clean title; the fragmented
              visual spans are aria-hidden so they aren't read as "T u r n …". */}
          <h1
            aria-label={content.title}
            className="mt-4 max-w-[24ch] pb-[0.08em] leading-[1.12] text-[clamp(1.75rem,0.5rem+2.05vw,3rem)]"
          >
            <span aria-hidden="true">
              {(() => {
                const words = content.title.split(" ");
                let ci = 0;
                return words.map((word, wi) => (
                  <Fragment key={wi}>
                    {wi > 0 ? " " : null}
                    <span className="inline-block">
                      {Array.from(word).map((ch, chi) => {
                        const delay = (ci++ * 0.03).toFixed(2);
                        return (
                          <span
                            key={chi}
                            className="pb-write-char"
                            style={{ animationDelay: `${delay}s` }}
                          >
                            {ch}
                          </span>
                        );
                      })}
                    </span>
                  </Fragment>
                ));
              })()}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted">{content.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={installUrl("hero")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "gradient", size: "lg" })}
            >
              {content.primaryCta}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {/* Live demo storefront — new tab so the site isn't lost. */}
            <a
              href={site.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              {content.secondaryCta}
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

          {/* Microcopy */}
          <p className="mt-4 text-sm text-muted">{content.microcopy}</p>
        </div>

        {/* Feature preview slider — landscape, fills its column. The slider
            frames itself (subtle border) so the bright gradient edge no longer
            pulls focus off the image. */}
        <div className="relative mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-none">
          <HeroSlider slides={HERO_SLIDES} />
        </div>
      </div>
    </section>
  );
}
