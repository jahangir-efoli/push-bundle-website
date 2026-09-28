import { LocaleLink as Link } from "@/components/ui/locale-link";
import { LogoHolder } from "@/components/media/media-holder";
import { localeMeta, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { ClientStory } from "@/lib/cms";

/** Locale-aware short date ("Sep 28, 2026" / "2026年9月28日" …). */
export function formatStoryDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeMeta[locale].hreflang, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** Brand logo on a neutral tile; initials fallback when the CMS has none. */
export function ClientLogo({
  client,
  className,
}: {
  client: Pick<ClientStory, "name" | "logo">;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid h-24 place-items-center rounded-xl border border-border bg-surface-subtle px-6",
        className,
      )}
    >
      {client.logo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={client.logo}
          alt={`${client.name} logo`}
          className="max-h-14 max-w-full object-contain"
          loading="lazy"
        />
      ) : (
        <LogoHolder name={client.name} className="size-14 text-xl" />
      )}
    </div>
  );
}

/** Just what a listing card renders — keeps tags/author/SEO out of the
 * serialized props of the client-side grid (tags belong to the story page). */
export type ClientCardData = Pick<ClientStory, "slug" | "name" | "excerpt" | "logo">;

/**
 * Client showcase card — outlined glass card with a small logo tile, bold title,
 * 3-line excerpt and a compact "Read More" ghost button; lifts with a blue glow
 * on hover. Heights follow content (the grid top-aligns cards).
 *
 * One real link — the CTA — whose `::after` stretches over the card, so the
 * whole card is the (large) hit target while screen readers hear a single,
 * named link. That is also why the visual button can be compact.
 */
export function ClientCard({
  client,
  readMore,
  titleAs: Tag = "h2",
}: {
  client: ClientCardData;
  readMore: string;
  titleAs?: "h2" | "h3";
}) {
  return (
    <article
      className={cn(
        "group relative rounded-[14px] border p-5",
        "border-foreground/15 bg-surface dark:border-white/75 dark:bg-white/[0.11]",
        "transition-[transform,border-color,box-shadow] duration-200",
        "hover:-translate-y-[3px] hover:border-primary/40",
        "hover:shadow-[0_14px_40px_-14px_color-mix(in_oklab,var(--pb-blue-500)_75%,transparent)]",
      )}
    >
      <span
        className={cn(
          "grid size-11 place-items-center overflow-hidden rounded-[10px] border p-[5px]",
          "border-border bg-surface-subtle",
          "dark:border-accent/30 dark:bg-accent/[0.08]",
          "dark:shadow-[0_0_14px_-2px_color-mix(in_oklab,var(--pb-cyan-400)_22%,transparent)]",
        )}
      >
        {client.logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <LogoHolder name={client.name} className="size-full rounded-md text-xs" />
        )}
      </span>

      <Tag className="mt-3 font-display text-[1.3rem] font-extrabold leading-7 text-balance text-foreground dark:text-white">
        {client.name}
      </Tag>

      <p className="mt-3 line-clamp-3 text-base leading-[1.55] text-pretty text-muted dark:text-white/70">
        {client.excerpt}
      </p>

      <Link
        href={`/clients-showcase/${client.slug}`}
        className={cn(
          "mt-5 inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition-colors",
          "border-foreground/20 bg-foreground/[0.04] text-foreground group-hover:bg-foreground/[0.08]",
          "dark:border-white/25 dark:bg-white/[0.06] dark:text-white/95 dark:group-hover:bg-white/[0.12]",
          "after:absolute after:inset-0 after:rounded-[14px] after:content-['']",
        )}
      >
        {readMore}
        <span className="sr-only">: {client.name}</span>
      </Link>
    </article>
  );
}
