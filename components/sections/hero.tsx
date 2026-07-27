import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";
import { HeroSlider } from "@/components/sections/hero-slider";
import { ShopifyMark } from "@/components/ui/shopify-mark";
import { site } from "@/lib/site-config";
import { hero } from "@/lib/content/home";
import type { AggregateRating } from "@/lib/cms";

/** Feature previews shown in the hero slider (4:5, in public/images/features). */
const HERO_SLIDES = [
  {
    src: "/images/features/feature-1.png",
    alt: "PushBundle mix-and-match single-product bundle builder with tiered box discounts",
  },
  {
    src: "/images/features/feature-2.png",
    alt: "PushBundle mix-and-match multi-product bundle builder across product categories",
  },
  {
    src: "/images/features/feature-3.png",
    alt: "PushBundle build-your-own gift box flow with step-by-step product selection",
  },
  {
    src: "/images/features/feature-4.png",
    alt: "PushBundle cross-sell bundle pairing complementary products at a set discount",
  },
  {
    src: "/images/features/feature-5.png",
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
export function Hero({ rating }: { rating: AggregateRating }) {
  return (
    // Fills the viewport below the 5rem header. `svh` (not `vh`) so mobile
    // browser chrome doesn't push content off-screen; `min-h` (not `h`) so the
    // hero can still grow on short screens or with longer translated copy.
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-background text-foreground">
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

      <Container className="relative grid items-center gap-8 pt-8 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-10 lg:pb-20">
        <div>
          {/* Trust pill: badge + live rating */}
          <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold shadow-soft">
            <span className="flex items-center gap-1.5">
              <ShopifyMark className="size-4" />
              Built for Shopify
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="text-muted">
              {rating.score} <span className="text-warning">★</span> ·{" "}
              {rating.count} reviews
            </span>
          </div>

          <h1 className="mt-4 max-w-[19ch] text-display-xl">{hero.title}</h1>

          <p className="mt-6 max-w-xl text-lg text-muted">{hero.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={site.shopifyAppUrl}
              className={buttonStyles({ variant: "gradient", size: "lg" })}
            >
              {hero.primaryCta}
            </a>
            {/* Live demo storefront — new tab so the site isn't lost. */}
            <a
              href={site.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              {hero.secondaryCta}
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
          <p className="mt-4 text-sm text-muted">
            Free plan available · 14-day trial · No credit card
          </p>
        </div>

        {/* Feature preview slider (public/images/features) */}
        <div className="relative mx-auto w-full max-w-sm lg:ml-auto lg:max-w-md">
          <div className="rounded-[1.25rem] bg-brand-gradient p-1.5 shadow-lift">
            <HeroSlider slides={HERO_SLIDES} />
          </div>
        </div>
      </Container>
    </section>
  );
}
