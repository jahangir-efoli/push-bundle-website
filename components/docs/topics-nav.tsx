import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Icon } from "@/components/ui/icon";
import { topicIcon, type DocTopic } from "@/lib/docs/topics";
import { cn } from "@/lib/utils";

/**
 * Topic list beside a topic page (docs/PLAN.md §5.8b). A sticky column on
 * desktop; below lg it becomes a horizontally scrolling row of chips.
 */
export function TopicsNav({
  topics,
  current,
  label,
}: {
  topics: DocTopic[];
  current?: string;
  label: string;
}) {
  return (
    <nav aria-label={label} className="lg:sticky lg:top-28">
      <p className="mb-3 hidden text-xs font-semibold uppercase tracking-widest text-muted lg:block">
        {label}
      </p>
      <ul className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:p-0">
        {topics.map((topic) => {
          const on = topic.slug === current;
          return (
            <li key={topic.slug} className="shrink-0">
              <Link
                href={`/docs/category/${topic.slug}`}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center gap-2.5 whitespace-nowrap rounded-xl border px-3 text-sm transition-colors lg:whitespace-normal lg:border-transparent",
                  on
                    ? "border-primary/40 bg-primary-subtle font-semibold text-foreground"
                    : "border-border text-muted hover:bg-surface-subtle hover:text-foreground",
                )}
              >
                <Icon name={topicIcon(topic.slug)} className="size-4 shrink-0" />
                <span className="flex-1">{topic.name}</span>
                <span className="hidden text-xs text-muted lg:inline">
                  {topic.docs.length}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
