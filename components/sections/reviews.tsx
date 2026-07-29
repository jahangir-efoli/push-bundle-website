import { Section } from "@/components/ui/section";
import { site } from "@/lib/site-config";
import { Eyebrow } from "@/components/ui/eyebrow";
import { reviewsSection } from "@/lib/content/home";
import type { AggregateRating, Review } from "@/lib/cms";

/**
 * Reviews / social proof (docs/PLAN.md §5.1 §8) — CMS-driven (the CMS stores
 * these as "opinions"; the adapter maps them to `Review`).
 *
 * A smooth, continuously auto-scrolling marquee (CSS-only — see `.marquee` in
 * globals.css). It pauses on hover/focus and the hovered card zooms; under
 * reduced-motion it stops and becomes horizontally scrollable. The visible
 * rating must match the Review/AggregateRating JSON-LD.
 */
function ReviewCard({
  review,
  ariaHidden = false,
}: {
  review: Review;
  ariaHidden?: boolean;
}) {
  return (
    <li
      aria-hidden={ariaHidden || undefined}
      className="mr-6 w-[min(84vw,360px)] shrink-0"
    >
      <div className="group/card relative flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:z-10 hover:scale-[1.04] hover:border-primary/40 hover:shadow-lift">
        {/* aria-label is prohibited on <p>; use visually-hidden text. */}
        <p className="text-warning">
          <span aria-hidden="true">{"★".repeat(review.rating)}</span>
          <span className="sr-only">Rated {review.rating} out of 5</span>
        </p>
        <blockquote className="mt-3 line-clamp-6 flex-1 text-foreground">
          “{review.quote}”
        </blockquote>
        <footer className="mt-4 text-sm text-muted">
          {review.author}
          {review.country ? ` · ${review.country}` : ""}
        </footer>
      </div>
    </li>
  );
}

export function Reviews({
  reviews,
  rating,
  eyebrow = "Social proof",
  title = reviewsSection.title,
  subtitle = reviewsSection.subtitle,
}: {
  reviews: Review[];
  rating: AggregateRating;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md">{title}</h2>
          <p className="mt-4 text-muted">{subtitle}</p>
        </div>

        <p className="text-muted">
          <span className="font-display text-display-sm font-bold text-foreground">
            {rating.score}
          </span>{" "}
          out of 5 ·{" "}
          <a
            href={site.shopifyAppUrl}
            className="text-primary underline underline-offset-4"
          >
            {rating.count} reviews
          </a>
        </p>
      </div>

      {/* Auto-scrolling marquee. Cards are rendered twice (the copy is
          aria-hidden) so the -50% loop is seamless. */}
      {/* py-10 so each card's soft shadow fades fully inside the marquee's clip
          box — otherwise `overflow:hidden` cuts the shadow into a hard band. */}
      <div className="marquee mt-8">
        <ul className="marquee-track py-10">
          {reviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
          {reviews.map((review) => (
            <ReviewCard key={`dup-${review.slug}`} review={review} ariaHidden />
          ))}
        </ul>
      </div>
    </Section>
  );
}
