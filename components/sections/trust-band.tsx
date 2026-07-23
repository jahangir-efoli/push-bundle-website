import { Container } from "@/components/ui/container";
import { site } from "@/lib/site-config";
import type { AggregateRating } from "@/lib/cms";

/**
 * Compact trust strip (docs/PLAN.md §5.2 §5) — Built for Shopify + rating +
 * compatibility marks. Reused on Pricing and elsewhere. Server Component.
 */
export function TrustBand({ rating }: { rating: AggregateRating }) {
  return (
    <section className="border-y border-border bg-surface-subtle">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 text-sm text-muted">
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <span aria-hidden="true" className="text-accent-foreground">
            ✦
          </span>
          Built for Shopify
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="text-warning-foreground">
            ★★★★★
          </span>
          {rating.score} · {rating.count} reviews
        </span>
        <span>Works with Checkout · POS · Markets · PageFly · GemPages</span>
        <a
          href={site.shopifyAppUrl}
          className="font-semibold text-primary underline underline-offset-4"
        >
          View on the App Store
        </a>
      </Container>
    </section>
  );
}
