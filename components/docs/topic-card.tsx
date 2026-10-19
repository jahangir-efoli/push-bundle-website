import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Icon } from "@/components/ui/icon";
import { topicIcon, type DocTopic } from "@/lib/docs/topics";
import { fmt } from "@/lib/utils";

/**
 * Topic card on the help-centre home (docs/PLAN.md §5.8a): icon, name, guide
 * count, description, its first three guides and a link to the topic page.
 */
export function TopicCard({
  topic,
  description,
  countLabel,
  viewAll,
}: {
  topic: DocTopic;
  description?: string;
  /** Already-formatted "{n} guides". */
  countLabel: string;
  /** "View all {n} guides" template. */
  viewAll: string;
}) {
  const href = `/docs/category/${topic.slug}`;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-lift">
      <Link href={href} className="group flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-subtle text-primary">
          <Icon name={topicIcon(topic.slug)} className="size-5" />
        </span>
        <span>
          <h3 className="font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {topic.name}
          </h3>
          <span className="text-sm text-muted">{countLabel}</span>
        </span>
      </Link>

      {description && <p className="text-sm text-muted">{description}</p>}

      <ul className="border-t border-border">
        {topic.docs.slice(0, 3).map((doc) => (
          <li key={doc.slug}>
            <Link
              href={`/docs/${doc.slug}`}
              className="flex items-start gap-2 border-b border-border py-2.5 text-sm text-foreground transition-colors hover:text-primary"
            >
              <Icon name="file-text" className="mt-0.5 size-4 shrink-0 text-muted" />
              <span>{doc.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="group mt-auto inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary"
      >
        {fmt(viewAll, { n: topic.docs.length })}
        <Icon
          name="arrow-right"
          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
