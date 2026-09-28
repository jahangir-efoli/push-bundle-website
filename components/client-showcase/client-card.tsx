import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Card } from "@/components/ui/card";
import { LogoHolder } from "@/components/media/media-holder";
import { buttonStyles } from "@/components/ui/button";
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

/**
 * Client showcase card (like a partner card, plus a "read the story" CTA). One
 * real link — the CTA — whose `::after` stretches over the card, so the whole
 * card is clickable while screen readers hear a single, named link.
 */
export function ClientCard({
  client,
  readMore,
  titleAs: Tag = "h2",
}: {
  client: ClientStory;
  readMore: string;
  titleAs?: "h2" | "h3";
}) {
  return (
    <Card as="article" interactive className="relative flex h-full flex-col">
      <ClientLogo client={client} />

      <Tag className="mt-5 font-display text-lg font-bold text-balance text-foreground">
        {client.name}
      </Tag>

      {client.tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {client.tags.slice(0, 2).map((t) => (
            <li
              key={t.slug}
              className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary"
            >
              {t.name}
            </li>
          ))}
        </ul>
      )}

      {/* No flex-1 on the clamped text: a flex-grown box renders lines past the
          clamp in Chrome. The CTA wrapper takes the remaining height instead. */}
      <p className="mt-3 line-clamp-3 text-sm text-pretty text-muted">{client.excerpt}</p>

      <div className="mt-auto pt-6">
        <Link
          href={`/client-showcase/${client.slug}`}
          className={buttonStyles({
            variant: "secondary",
            size: "sm",
            className: "w-fit after:absolute after:inset-0 after:rounded-xl after:content-['']",
          })}
        >
          {readMore}
          <span className="sr-only">: {client.name}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Card>
  );
}
