import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Icon } from "@/components/ui/icon";
import { fmt } from "@/lib/utils";

/**
 * One guide as a full-width row (docs/PLAN.md §5.8) — used for popular guides,
 * a topic's guide list and search results. Leads with its position in the
 * topic when `number` is set, otherwise a document tile.
 */
export function DocRow({
  doc,
  minRead,
  number,
  topic,
  title,
}: {
  doc: { slug: string; title: string; readingTimeMinutes?: number };
  /** "{n} min read" template. */
  minRead: string;
  number?: number;
  /** Topic name shown before the read time. */
  topic?: string;
  /** Overrides the plain title (e.g. with search highlights). */
  title?: React.ReactNode;
}) {
  const meta = [
    topic,
    doc.readingTimeMinutes ? fmt(minRead, { n: doc.readingTimeMinutes }) : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/docs/${doc.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-4 shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift sm:px-5"
    >
      {number ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border text-sm text-muted">
          {number}
        </span>
      ) : (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-subtle text-primary">
          <Icon name="file-text" className="size-5" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title ?? doc.title}
        </span>
        {meta.length > 0 && (
          <span className="mt-0.5 block text-sm text-muted">{meta.join(" · ")}</span>
        )}
      </span>
      <Icon
        name="arrow-right"
        className="size-5 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-primary"
      />
    </Link>
  );
}
