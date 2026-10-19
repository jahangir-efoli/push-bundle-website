import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LogoHolder } from "@/components/media/media-holder";
import type { ClientStory } from "@/lib/cms";

/** Just what a listing card renders — keeps tags/author/SEO out of the
 * serialized props of the client-side grid (tags belong to the story page). */
export type ClientCardData = Pick<ClientStory, "slug" | "name" | "excerpt" | "logo">;

/**
 * Client showcase card — deliberately the same card as the Partners grid (Card +
 * LogoHolder + CardTitle + CardDescription + underlined text link, equal-height
 * rows), with the excerpt clamped to 3 lines and an ellipsis.
 *
 * One real link — "Read More" — whose `::after` stretches over the card, so the
 * whole card is clickable while screen readers hear a single, named link.
 */
export function ClientCard({
  client,
  readMore,
  titleAs = "h2",
}: {
  client: ClientCardData;
  readMore: string;
  titleAs?: "h2" | "h3";
}) {
  return (
    <Card className="relative flex h-full flex-col">
      <LogoHolder src={client.logo} name={client.name} />
      <CardTitle as={titleAs} className="mt-5 text-lg">
        {client.name}
      </CardTitle>
      {/* The wrapper takes the spare height so the clamped text stays exactly
          3 lines (a flex-grown line-clamp box renders past the clamp in Chrome). */}
      <div className="flex-1">
        <CardDescription className="line-clamp-3">{client.excerpt}</CardDescription>
      </div>
      <Link
        href={`/clients-showcase/${client.slug}`}
        className="mt-5 inline-flex min-h-11 w-fit items-center font-semibold text-primary underline underline-offset-4 after:absolute after:inset-0 after:rounded-xl after:content-['']"
      >
        {readMore}
        <span className="sr-only">: {client.name}</span>
        <span aria-hidden="true" className="ml-1">
          →
        </span>
      </Link>
    </Card>
  );
}
