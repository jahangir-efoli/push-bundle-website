import { Container } from "@/components/ui/container";
import { installUrl } from "@/lib/site-config";
import type { AggregateRating } from "@/lib/cms";

/** Localized trust-strip copy (defaults are English). */
export type TrustBandContent = {
  builtForShopify: string;
  /** Noun after the count, e.g. "reviews". */
  reviews: string;
  compatibility: string;
  viewOnAppStore: string;
};

const DEFAULT_CONTENT: TrustBandContent = {
  builtForShopify: "Built for Shopify",
  reviews: "reviews",
  compatibility: "Works with Checkout · POS · Markets · PageFly · GemPages",
  viewOnAppStore: "View on the App Store",
};

/**
 * Compact trust strip (docs/PLAN.md §5.2 §5) — Built for Shopify + rating +
 * compatibility marks. Reused on Pricing and elsewhere. Server Component.
 */
export function TrustBand({
  rating,
  content = DEFAULT_CONTENT,
}: {
  rating: AggregateRating;
  content?: TrustBandContent;
}) {
  return (
    <section className="border-y border-border bg-surface-subtle">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 text-sm text-muted">
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <span aria-hidden="true" className="text-accent-foreground">
            ✦
          </span>
          {content.builtForShopify}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-warning-foreground">
            ★★★★★
          </span>
          {rating.score} · {rating.count} {content.reviews}
        </span>
        <span>{content.compatibility}</span>
        <a
          href={installUrl("trust-band")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline underline-offset-4"
        >
          {content.viewOnAppStore}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Container>
    </section>
  );
}
